"""OpenAI-based email parser service."""
import json
import logging
from typing import Dict, Any, Optional
from openai import OpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailParser:
    """Service for parsing emails using OpenAI."""
    
    def __init__(self):
        self.client = None
        self.model = "gpt-4-turbo-preview"  # Supports JSON mode
        
    def _get_client(self) -> OpenAI:
        """Lazy initialization of OpenAI client."""
        if self.client is None:
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is not configured")
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        return self.client
    
    def _build_system_prompt(self, schema: Dict[str, Any]) -> str:
        """Build the system prompt for email parsing."""
        return f"""You are an expert email parser specialized in extracting structured data from commercial offer emails.

Your task is to analyze email content and extract information according to the provided JSON schema.

## Output Requirements:
1. Return ONLY valid JSON that matches the schema structure
2. Use null for any fields not found in the email
3. Be precise with numbers, currencies, and dates
4. Extract exact values when possible, don't paraphrase
5. For nested objects, include all sub-fields even if null

## JSON Schema to follow:
{json.dumps(schema, indent=2)}

## Important:
- Do NOT include any text before or after the JSON
- Do NOT wrap the JSON in markdown code blocks
- Ensure all required fields from the schema are present"""

    def _build_user_prompt(self, email_body: str, subject: str = "", sender: str = "") -> str:
        """Build the user prompt with email content."""
        prompt_parts = ["## Email to Parse:\n"]
        
        if subject:
            prompt_parts.append(f"**Subject:** {subject}\n")
        if sender:
            prompt_parts.append(f"**From:** {sender}\n")
        
        prompt_parts.append(f"\n**Body:**\n{email_body}")
        
        # Truncate if too long (keep under ~6000 tokens worth)
        full_prompt = "\n".join(prompt_parts)
        max_chars = 20000  # Roughly 5000 tokens
        if len(full_prompt) > max_chars:
            full_prompt = full_prompt[:max_chars] + "\n\n[Email truncated due to length]"
        
        return full_prompt

    def parse_email(
        self,
        email_body: str,
        schema: Dict[str, Any],
        subject: str = "",
        sender: str = "",
    ) -> Dict[str, Any]:
        """
        Parse an email and extract structured data.
        
        Args:
            email_body: The email text content
            schema: JSON schema defining the expected output structure
            subject: Email subject line (optional, helps with context)
            sender: Email sender (optional, helps with context)
            
        Returns:
            Dictionary containing:
                - success: bool
                - data: parsed data dict (if successful)
                - error: error message (if failed)
                - model: model used
                - usage: token usage stats
        """
        try:
            client = self._get_client()
            
            system_prompt = self._build_system_prompt(schema)
            user_prompt = self._build_user_prompt(email_body, subject, sender)
            
            logger.info(f"Parsing email with subject: {subject[:50]}...")
            
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1,  # Low temperature for consistent extraction
                max_tokens=2000,
            )
            
            # Extract the response
            content = response.choices[0].message.content
            
            # Parse the JSON response
            try:
                parsed_data = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse OpenAI response as JSON: {e}")
                return {
                    "success": False,
                    "error": f"Invalid JSON response from OpenAI: {str(e)}",
                    "raw_response": content,
                    "model": self.model,
                }
            
            # Get usage stats
            usage = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens,
            }
            
            logger.info(f"Successfully parsed email. Tokens used: {usage['total_tokens']}")
            
            return {
                "success": True,
                "data": parsed_data,
                "model": self.model,
                "usage": usage,
            }
            
        except Exception as e:
            logger.error(f"Error parsing email: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "model": self.model,
            }


# Singleton instance
email_parser = EmailParser()


def parse_email(
    email_body: str,
    schema: Dict[str, Any],
    subject: str = "",
    sender: str = "",
) -> Dict[str, Any]:
    """Convenience function to parse an email."""
    return email_parser.parse_email(email_body, schema, subject, sender)

