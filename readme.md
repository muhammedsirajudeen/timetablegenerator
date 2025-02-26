# 📅 Automatic Timetable Generator

An automatic timetable generator for colleges that efficiently schedules classes based on given semester and teacher data.

## 🚀 Features

- Generates optimized timetables for multiple semesters.
- Ensures no scheduling conflicts between teachers and subjects.
- Supports customization for working hours, break times, and constraints.
- Exportable timetables in various formats (CSV, JSON, PDF).
- Easy-to-use interface for data input.

## 🛠️ Installation

### Prerequisites
- Python (latest recommended)
- Node.js (for Next.js frontend)
- Pipenv (for Python dependency management)

### Steps
1. **Clone the repository**  
   ```bash
   git clone https://github.com/yourusername/timetable-generator.git
   cd timetable-generator
   ```

2. **Set up Python backend**  
   ```bash
   cd backend
   pipenv install
   ```

3. **Set up Next.js frontend**  
   ```bash
   cd frontend
   npm install
   ```

## 🏃 Usage

1. **Run the backend server**  
   ```bash
   cd backend
   pipenv run python app.py
   ```

2. **Run the Next.js frontend**  
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and visit:  
   ```
   http://localhost:3000
   ```

## 📂 Project Structure

```
timetable-generator/
│── backend/         # Python-based scheduling logic
│── frontend/        # Next.js frontend
│── data/            # Semester and teacher data
│── README.md        # Project documentation
│── .gitignore       # Ignore unnecessary files
```

## ✨ Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added new feature"`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## 📜 License

This project is licensed under the MIT License.

---

Made with ❤️ for better academic scheduling! 🚀

