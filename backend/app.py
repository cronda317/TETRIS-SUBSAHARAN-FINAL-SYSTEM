from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import Session
from database import engine, get_db
import models
from typing import List
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Create database tables
models.Base.metadata.create_all(bind=engine)

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    db: Session = next(get_db())
    tasks = db.query(models.Task).all()
    return jsonify([{
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None
    } for task in tasks])

@app.route("/api/tasks", methods=["POST"])
def create_task():
    db: Session = next(get_db())
    data = request.json
    
    task = models.Task(
        title=data["title"],
        description=data.get("description", ""),
        completed=data.get("completed", False)
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None
    })

@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id: int):
    db: Session = next(get_db())
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    data = request.json
    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)
    task.completed = data.get("completed", task.completed)
    
    db.commit()
    db.refresh(task)
    
    return jsonify({
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "created_at": task.created_at.isoformat() if task.created_at else None,
        "updated_at": task.updated_at.isoformat() if task.updated_at else None
    })

@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id: int):
    db: Session = next(get_db())
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    
    if not task:
        return jsonify({"error": "Task not found"}), 404
    
    db.delete(task)
    db.commit()
    
    return jsonify({"message": "Task deleted successfully"})

if __name__ == "__main__":
    app.run(debug=True, port=5000) 