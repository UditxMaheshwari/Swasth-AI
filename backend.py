import os
import re
os.environ["TEAM_API_KEY"] = "67e2e7cf5f6a121a8e2cd072d5e9c72c0098903eab1574aa108e2d885c73126d"


from flask import Flask, request, jsonify
from flask_cors import CORS
from langdetect import detect
from aixplain.factories import ModelFactory, AgentFactory

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

def remove_markdown(text):
    """Removes markdown symbols and extra spaces from text."""
    text = re.sub(r'\*\*.*?\*\*', '', text)  # Remove headers (e.g., **Header**)
    text = re.sub(r'[\*\-] ', '', text)  # Remove bullet points
    text = re.sub(r'[#\*_\[\]()]', '', text)  # Remove markdown symbols
    text = re.sub(r'\n+', '\n', text).strip()  # Remove extra newlines
    return text


def format_text(text):
    """Formats text into structured paragraphs."""
    sections = text.split("\n")
    formatted_text = "\n\n".join(section.strip() for section in sections if section.strip())
    return formatted_text

# Load AI models
doc_model = ModelFactory.get("67a220feb6353d81be0f0f2f")
summ_model = ModelFactory.get("67a1cccff3e3f6c52370a36b")
main_agent = AgentFactory.get("67a1cd61f3e3f6c52370a36c")

@app.route("/ask", methods=["POST"])
def ask():
    """Handles AI health advice and summary generation."""
    try:
        data = request.json
        question = data.get("question", "")

        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Detect language
        output_language = detect(question)

        # Get AI response
        formatted_query = f"{question} Response in {output_language}"
        agent_response = main_agent.run(formatted_query)
        formatted_response = agent_response["data"]["output"]
        form_response = remove_markdown(formatted_response)
        agent_answer = format_text(form_response)

        # Generate summary
        summ = summ_model.run({
            "question": question,
            "response": f"{formatted_response}",
            "language": output_language
        })["data"]
        corrected_text = summ.encode('latin1').decode('utf-8')
        corr_text = remove_markdown(corrected_text)
        summary = format_text(corr_text)

        return jsonify({
            "response": agent_answer,
            "summary": summary
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route("/doctors", methods=["POST"])
def find_doctors():
    """Handles doctor recommendations based on health condition and location."""
    try:
        data = request.json
        condition = data.get("condition", "")
        location = data.get("location", "")

        if not condition or not location:
            return jsonify({"error": "Condition and location required"}), 400

        # Fetch nearby doctors
        doctors = doc_model.run({
            "condition": condition,
            "location": location
        })["data"]

        return jsonify({"doctors": doctors})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)

