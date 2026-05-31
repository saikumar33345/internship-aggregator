from fastapi import APIRouter,HTTPException,Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.alert import AlertFilter
from app.schemas.alert import AlertCreate,AlertResponse
from app.services.auth import get_current_user
from app.models.user import User

router=APIRouter(prefix="/alerts",tags=["Alerts"])

@router.post("/",response_model=AlertResponse)
def create_alert(alert:AlertCreate,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    new_alert=AlertFilter(
        user_id=current_user.id,
        keywords=alert.keywords,
        location=alert.location,
        min_salary=alert.min_salary
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert

@router.get("/",response_model=List[AlertResponse])
def get_alerts(db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    alerts=db.query(AlertFilter).filter(AlertFilter.user_id==current_user.id).all()
    return alerts

@router.delete("/{id}")
def delete_alert(id:int,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    alert=db.query(AlertFilter).filter(AlertFilter.id==id,AlertFilter.user_id==current_user.id).first()
    if not alert:
        raise HTTPException(status_code=404,detail="NOT FOUND")
    db.delete(alert)
    db.commit()
    return {"message":"Alert Deleted Successfully"}

