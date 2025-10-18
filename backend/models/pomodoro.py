from backend.extensions import db

class PomodoroSession(db.Model):
    __tablename__ = "pomodoro_sessions"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_sub = db.Column(db.String, index=True, nullable=False)
    task_id = db.Column(db.String, db.ForeignKey("tasks.id"), nullable=True)
    start_time = db.Column(db.String, nullable=False)
    end_time = db.Column(db.String, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    completed = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "userSub": self.user_sub,
            "taskId": self.task_id,
            "startTime": self.start_time,
            "endTime": self.end_time,
            "duration": self.duration,
            "completed": self.completed,
        }
