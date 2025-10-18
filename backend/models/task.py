<<<<<<< HEAD
from backend.extensions import db
=======
from . import db
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)

# ==============================================================
# MODELO: TASK
# ==============================================================

class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.String, primary_key=True)
    uuid = db.Column(db.String(64), unique=True, nullable=False)
    user_sub = db.Column(db.String, index=True, nullable=False)
    title = db.Column(db.String, nullable=False)
    scope = db.Column(db.String, nullable=True)
    priority = db.Column(db.String, nullable=True)
    due_date = db.Column(db.String, nullable=True)
    estimated_minutes = db.Column(db.Integer, default=0)
    status = db.Column(db.String, default="pending")  # pending | inprogress | done
    important = db.Column(db.Boolean, default=False)
    urgent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.String, nullable=False)
    updated_at = db.Column(db.String, nullable=False)
    deleted = db.Column(db.Boolean, default=False)

    # Relación con etiquetas (tags)
    tags = db.relationship("Tag", secondary="task_tags", back_populates="tasks")

    def to_dict(self):
        return {
            "id": self.id,
            "userSub": self.user_sub,
            "title": self.title,
            "scope": self.scope,
            "priority": self.priority,
            "dueDate": self.due_date,
            "estimatedMinutes": self.estimated_minutes,
            "status": self.status,
            "important": self.important,
            "urgent": self.urgent,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
            "deleted": self.deleted,
            "tags": [t.to_dict() for t in self.tags] if self.tags else []
        }
