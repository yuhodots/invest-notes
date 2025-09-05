#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AI Translator for Investment Blog
Translates Korean blog posts to English
"""

import argparse
import os
import sys
from pathlib import Path
from typing import Optional
import yaml

from prompts.translator_system_prompt import TRANSLATOR_SYSTEM_PROMPT
from prompts.translator_prompt_template import TRNASLATOR_PROMPT_TEMPLATE
from util import request_openai_api


class ContentTranslator:

    def load_markdown_post(self, file_path: str) -> tuple[dict, str]:
        """Load markdown file with frontmatter"""
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Parse YAML frontmatter manually
        if content.startswith("---\n"):
            parts = content.split("---\n", 2)
            if len(parts) >= 3:
                metadata = yaml.safe_load(parts[1])
                content = parts[2].strip()
                return metadata, content

        return {}, content

    def translate_content(self, korean_content: str, title: str) -> str:
        """Translate Korean content to English using OpenAI API"""
        try:
            return request_openai_api(
                prompt=TRNASLATOR_PROMPT_TEMPLATE.format(
                    title=title, content=korean_content
                ),
                system_prompt=TRANSLATOR_SYSTEM_PROMPT,
                model="gpt-5",
            )

        except Exception as e:
            raise RuntimeError(f"Failed to translate content: {str(e)}")

    def translate_title(self, korean_title: str) -> str:
        """Translate Korean title to English"""
        try:
            return request_openai_api(
                prompt=f"Translate this Korean investment blog title to English: '{korean_title}'",
                system_prompt="You are a professional translator specializing in financial and investment content. Translate the given Korean blog post title to natural, engaging English suitable for investment blogs.",
                model="gpt-5",
            )

        except Exception as e:
            print(f"Warning: Failed to translate title, using original: {str(e)}")
            return korean_title

    def create_english_post(
        self,
        korean_metadata: dict,
        english_content: str,
        english_title: str,
        output_path: str,
    ) -> None:
        """Create English markdown file with translated content"""

        # Create English metadata based on Korean metadata
        english_metadata = korean_metadata.copy()
        english_metadata.update(
            {
                "title": english_title,
                "category": korean_metadata.get("category", "Economics"),
                "description": self._extract_description(english_content),
            }
        )

        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Write the English markdown file with YAML frontmatter
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("---\n")
            f.write(
                yaml.dump(
                    english_metadata, allow_unicode=True, default_flow_style=False
                )
            )
            f.write("---\n\n")
            f.write(english_content)

        print(f"✅ English content generated: {output_path}")

    def _extract_description(self, content: str) -> str:
        """Extract a brief description from English content"""
        lines = content.split("\n")
        for line in lines:
            line = line.strip()
            if line and not line.startswith("#") and len(line) > 50:
                # Take first meaningful paragraph, limit to 150 chars
                return (line[:300] + "...") if len(line) > 300 else line

        return "Professional analysis and insights on investment and economics."


def main():
    parser = argparse.ArgumentParser(
        description="Translate Korean blog posts to English"
    )
    parser.add_argument(
        "--input", required=True, help="Input Korean markdown file path"
    )
    parser.add_argument(
        "--output", required=True, help="Output English markdown file path"
    )

    args = parser.parse_args()

    try:
        # Check if input file exists
        if not Path(args.input).exists():
            raise FileNotFoundError(f"Input file not found: {args.input}")

        # Initialize translator
        translator = ContentTranslator()

        # Load Korean content
        print(f"🔄 Loading Korean content: {args.input}")
        korean_metadata, korean_content = translator.load_markdown_post(args.input)

        # Translate title
        print(f"🔄 Translating title: {korean_metadata.get('title', 'Unknown')}")
        english_title = translator.translate_title(korean_metadata.get("title", ""))

        # Translate content
        print("🔄 Translating content...")
        english_content = translator.translate_content(
            korean_content, korean_metadata.get("title", "")
        )

        # Create English markdown file
        translator.create_english_post(
            korean_metadata=korean_metadata,
            english_content=english_content,
            english_title=english_title,
            output_path=args.output,
        )

        print("✨ Translation completed successfully!")
        print(f"📝 English title: {english_title}")

    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
