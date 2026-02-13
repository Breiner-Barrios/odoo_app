from django.urls import path
from .views import LeadListAPIView, LeadUpdateStageAPIView

urlpatterns = [
    path('leads/', LeadListAPIView.as_view(), name='lead-list'),
    path('leads/<int:pk>/', LeadUpdateStageAPIView.as_view(), name='lead-update'),
]