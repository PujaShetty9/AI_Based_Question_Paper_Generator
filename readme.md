/**
 * Frontend/Backend Setup Instructions
 * 
 * To run the development server:
 * 1. Open your terminal
 * 2. Navigate to the project directory: `cd <project-folder>`
 * 3. Start the dev server: `npm run dev`
 * 
  to run BACKEND locally : 
   cd backend
   pip install -r requirements.txt    # Install all dependencies
   python app.py                      # Then start the server

 * That's it! Your app will be running locally.
 */

 // if error arrives to run backend then follow this : it's the virtual env approach
(python -m pip install google-generativeai) 
pip install protobuf==4.25.4

python --version
python -m venv venv
source venv/Scripts/activate
pip install google-generativeai flask flask-cors sentence-transformers reportlab python-docx mysql-connector-python
python app.py
pip freeze > requirements.txt