<<<<<<< HEAD
from backend.extensions import db
=======
from . import db
>>>>>>> 9690f33 (chore: normalize imports, unify auth token handling, fix jwt-decode import, Vite port and misc fixes)

# ==============================================================
# MODELO: TAG (Etiqueta o categoría personalizada)
# ==============================================================

# Tabla intermedia para relación muchos a muchos (Task <-> Tag)
task_tags = db.Table(
    "task_tags",
    db.Column("task_id", db.String, db.ForeignKey("tasks.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)

class Tag(db.Model):
    __tablename__ = "tags"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_sub = db.Column(db.String, index=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    color = db.Column(db.String, nullable=True)  # opcional (ej. #FF5733)

    tasks = db.relationship("Task", secondary=task_tags, back_populates="tags")

    def to_dict(self):
        return {
            "id": self.id,
            "userSub": self.user_sub,
            "name": self.name,
            "color": self.color
        }
