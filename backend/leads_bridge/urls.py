from django.urls import path
from .views import (
    LeadListAPIView, 
    LeadUpdateStageAPIView, 
    StageListAPIView,
    LeadCreateAPIView,
    LeadDeleteAPIView
)

urlpatterns = [
    path('leads/', LeadListAPIView.as_view(), name='lead-list'),
    path('leads/create/', LeadCreateAPIView.as_view(), name='lead-create'), #POST
    path('leads/<int:pk>/', LeadUpdateStageAPIView.as_view(), name='lead-update'),
    path('leads/<int:pk>/delete/', LeadDeleteAPIView.as_view(), name='lead-delete'), #DELETE
    path('stages/', StageListAPIView.as_view(), name='stage-list'),
]