#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Content Writer for Investment Blog
Generates Korean blog posts based on GitHub issues
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

import frontmatter
from openai import OpenAI

from prompts.writer_system_prompt import WRITER_SYSTEM_PROMPT
from prompts.writer_prompt_template import WRITER_PROMPT_TEMPLATE


class ContentWriter:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the content writer with OpenAI client"""
        self.client = OpenAI(api_key=api_key or os.getenv("OPENAI_API_KEY"))
        if not self.client.api_key:
            raise ValueError("OpenAI API key is required")

    def generate_content(self, title: str, body: str = "") -> str:
        """Generate blog content using OpenAI API"""

        try:
            response = self.client.chat.completions.create(
                model="gpt-5",
                messages=[
                    {"role": "system", "content": WRITER_SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": WRITER_PROMPT_TEMPLATE.format(
                            title=title, body=body
                        ),
                    },
                ],
                temperature=0.7,
                max_tokens=15000,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise RuntimeError(f"Failed to generate content: {str(e)}")

    def create_markdown_post(
        self, title: str, content: str, output_path: str, tags: list = None
    ) -> None:
        """Create a markdown file with frontmatter"""

        # Create frontmatter metadata
        post = frontmatter.Post(content)
        post.metadata = {
            "title": title,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "category": "투자",
            "tags": tags or ["투자", "경제", "금융"],
            "description": self._extract_description(content),
            "author": "AI Writer",
            "auto_generated": True,
        }

        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Write the markdown file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(frontmatter.dumps(post))

        print(f"✅ Korean content generated: {output_path}")

    def _extract_description(self, content: str) -> str:
        """Extract a brief description from content"""
        lines = content.split("\n")
        for line in lines:
            line = line.strip()
            if line and not line.startswith("#") and len(line) > 50:
                # Take first meaningful paragraph, limit to 150 chars
                return (line[:150] + "...") if len(line) > 150 else line

        return "투자와 경제에 대한 전문적인 분석과 인사이트를 제공합니다."


def main():
    parser = argparse.ArgumentParser(
        description="Generate blog content from GitHub issues"
    )
    parser.add_argument("--title", required=True, help="Issue title")
    parser.add_argument("--body", default="", help="Issue body content")
    parser.add_argument("--output", required=True, help="Output markdown file path")
    parser.add_argument("--language", default="korean", help="Content language")
    parser.add_argument("--tags", nargs="*", help="Blog post tags")

    args = parser.parse_args()

    try:
        # Initialize writer
        writer = ContentWriter()

        # Generate content
        print(f"🔄 Generating content for: {args.title}")
        content = writer.generate_content(args.title, args.body)

        # Create markdown file
        writer.create_markdown_post(
            title=args.title,
            content=content,
            output_path=args.output,
            yyyy_mm_dd=datetime.now().strftime("%Y-%m-%d"),
            tags=args.tags,
        )

        print("✨ Content generation completed successfully!")

    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
