from sheets_writer import write_to_sheet

test_data = """
{
  "Role": "Python Intern",
  "Company Name": "ABC Tech",
  "Location": "Hyderabad",
  "Primary Skills": ["Python","FastAPI","SQL"],
  "Years of Experience": "0-1",
  "Email": "hr@abctech.com"
}
"""

write_to_sheet(test_data)