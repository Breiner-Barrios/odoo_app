from django.urls import path
from .views import LeadListAPIView, LeadUpdateStageAPIView, StageListAPIView

urlpatterns = [
    path('leads/', LeadListAPIView.as_view(), name='lead-list'),
    path('leads/<int:pk>/', LeadUpdateStageAPIView.as_view(), name='lead-update'),
    path('stages/', StageListAPIView.as_view(), name='stage-list'),
]