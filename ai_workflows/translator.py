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

import frontmatter
from openai import OpenAI

from prompts.translator_system_prompt import TRANSLATOR_SYSTEM_PROMPT
from prompts.translator_prompt_template import TRNASLATOR_PROMPT_TEMPLATE


class ContentTranslator:
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the translator with OpenAI client"""
        self.client = OpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY")
        )
        if not self.client.api_key:
            raise ValueError("OpenAI API key is required")

    def load_markdown_post(self, file_path: str) -> tuple[dict, str]:
        """Load markdown file with frontmatter"""
        with open(file_path, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)

        return post.metadata, post.content

    def translate_content(self, korean_content: str, title: str) -> str:
        """Translate Korean content to English using OpenAI API"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-5",
                messages=[
                    {"role": "system", "content": TRANSLATOR_SYSTEM_PROMPT},
                    {"role": "user", "content": TRNASLATOR_PROMPT_TEMPLATE.format(title=title, content=korean_content)}
                ],
                temperature=0.3,  # Lower temperature for more consistent translation
                max_tokens=15000
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            raise RuntimeError(f"Failed to translate content: {str(e)}")

    def translate_title(self, korean_title: str) -> str:
        """Translate Korean title to English"""
        try:
            response = self.client.chat.completions.create(
                model="gpt-5",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional translator specializing in financial and investment content. Translate the given Korean blog post title to natural, engaging English suitable for investment blogs."
                    },
                    {
                        "role": "user",
                        "content": f"Translate this Korean investment blog title to English: '{korean_title}'"
                    }
                ],
                temperature=0.3,
                max_tokens=15000
            )

            return response.choices[0].message.content.strip().strip('"\'')

        except Exception as e:
            print(f"Warning: Failed to translate title, using original: {str(e)}")
            return korean_title

    def create_english_post(
        self,
        korean_metadata: dict,
        english_content: str,
        english_title: str,
        output_path: str
    ) -> None:
        """Create English markdown file with translated content"""

        # Create English metadata based on Korean metadata
        english_metadata = korean_metadata.copy()
        english_metadata.update({
            'title': english_title,
            'category': 'Investment',  # Translate category
            'tags': self._translate_tags(korean_metadata.get('tags', [])),
            'description': self._extract_description(english_content),
            'language': 'en',
            'translated_from': 'ko'
        })

        # Create frontmatter post
        post = frontmatter.Post(english_content)
        post.metadata = english_metadata

        # Ensure output directory exists
        output_file = Path(output_path)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        # Write the English markdown file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(frontmatter.dumps(post))

        print(f"✅ English content generated: {output_path}")

    def _translate_tags(self, korean_tags: list) -> list:
        """Translate Korean tags to English"""
        tag_mapping = {
            '투자': 'investment',
            '경제': 'economy',
            '금융': 'finance',
            '주식': 'stocks',
            '부동산': 'real-estate',
            '채권': 'bonds',
            '금리': 'interest-rates',
            '인플레이션': 'inflation',
            '시장분석': 'market-analysis',
            '리스크': 'risk',
            '포트폴리오': 'portfolio'
        }

        english_tags = []
        for tag in korean_tags:
            english_tag = tag_mapping.get(tag, tag.lower())
            english_tags.append(english_tag)

        return english_tags

    def _extract_description(self, content: str) -> str:
        """Extract a brief description from English content"""
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line and not line.startswith('#') and len(line) > 50:
                # Take first meaningful paragraph, limit to 150 chars
                return (line[:150] + '...') if len(line) > 150 else line

        return "Professional analysis and insights on investment and economics."


def main():
    parser = argparse.ArgumentParser(description='Translate Korean blog posts to English')
    parser.add_argument('--input', required=True, help='Input Korean markdown file path')
    parser.add_argument('--output', required=True, help='Output English markdown file path')

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
        english_title = translator.translate_title(korean_metadata.get('title', ''))

        # Translate content
        print(f"🔄 Translating content...")
        english_content = translator.translate_content(korean_content, korean_metadata.get('title', ''))

        # Create English markdown file
        translator.create_english_post(
            korean_metadata=korean_metadata,
            english_content=english_content,
            english_title=english_title,
            output_path=args.output
        )

        print("✨ Translation completed successfully!")
        print(f"📝 English title: {english_title}")

    except Exception as e:
        print(f"❌ Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
