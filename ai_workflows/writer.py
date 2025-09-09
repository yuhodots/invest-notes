#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Content Writer for Investment Blog
Generates Korean blog posts based on GitHub issues
"""

import argparse
import sys
from datetime import datetime
from pathlib import Path
import yaml

from prompts.writer_system_prompt import WRITER_SYSTEM_PROMPT
from prompts.writer_prompt_template import (
    WRITER_PROMPT_TEMPLATE,
    CATEGORY_SELECTION_PROMPT,
)
from util import request_openai_api

def create_markdown_post(
    title: str,
    content: str,
) -> None:
    """Create a markdown file with frontmatter"""

    # Create frontmatter metadata
    selected_category = request_openai_api(
        CATEGORY_SELECTION_PROMPT.format(title=title),
        system_prompt="You are an expert in categorizing investment blog topics.",
        model="gpt-5-mini",
    )
    selected_category = selected_category.strip().lower()
    if selected_category in ["indicators", "strategy", "chart"]:
        upper_category = "Strategy"
    elif selected_category in ["economics", "stock analysis"]:
        upper_category = "Economy"
    elif selected_category == "daily news":
        upper_category = "News"
    else:
        raise ValueError(f"Unknown category selected: {selected_category}")
    selected_category = selected_category.title()

    metadata = {
        "title": title,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "template": "post",
        "draft": False,
        "path": f"/{datetime.now().strftime('%y-%m-%d-%s')}/",
        "description": _extract_description(content),
        "category": selected_category,
    }

    # Ensure output directory exists
    output_path = (
        f"contents/kor/{upper_category}/{datetime.now().strftime('%Y-%m-%d')}-{title}.md"
    )
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Write the markdown file with YAML frontmatter
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("---\n")
        f.write(yaml.dump(metadata, allow_unicode=True, default_flow_style=False))
        f.write("---\n\n")
        f.write(content)

    print(f"✅ Korean content generated: {output_path}")
    # Output path for GitHub Actions to capture
    print(output_path)


def _extract_description(content: str) -> str:
    """Extract a brief description from content"""
    lines = content.split("\n")
    for line in lines:
        line = line.strip()
        if line and not line.startswith("#") and len(line) > 50:
            # Take first meaningful paragraph, limit to 150 chars
            return (line[:175] + "...") if len(line) > 175 else line

    raise ValueError("Failed to extract description from content")


def main():
    parser = argparse.ArgumentParser(
        description="Generate blog content from GitHub issues"
    )
    parser.add_argument("--title", required=True, help="Issue title")
    parser.add_argument("--body", default="", help="Issue body content")
    parser.add_argument("--language", default="korean", help="Content language")

    args = parser.parse_args()

    try:
        # Generate content
        print(f"🔄 Generating content for: {args.title}")
        content = request_openai_api(
            prompt=WRITER_PROMPT_TEMPLATE.format(title=args.title, body=args.body),
            system_prompt=WRITER_SYSTEM_PROMPT,
        )

        # Create markdown file
        create_markdown_post(
            title=args.title,
            content=content,
        )

        print("✨ Content generation completed successfully!")

    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
