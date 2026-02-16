from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services.odoo_service import OdooService
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class LeadListAPIView(APIView):
    def get(self, request):
        try:
            service = OdooService()
            leads = service.get_leads()
            return Response(leads, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class StageListAPIView(APIView):
    def get(self, request):
        try:
            service = OdooService()
            stages = service.get_stages()
            return Response(stages, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LeadUpdateStageAPIView(APIView):
    # Solo usuarios autenticados y administradores pueden acceder a esta vista
    permission_classes = [IsAuthenticated, IsAdminUser]
    def patch(self, request, pk):
        new_stage_id = request.data.get('stage_id')
        if not new_stage_id:
            return Response({"error": "stage_id is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            service = OdooService()
            success = service.update_lead_stage(pk, new_stage_id)
            if success:
                return Response({"message": "Lead updated"}, status=status.HTTP_200_OK)
            return Response({"error": "Failed to update Odoo"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)