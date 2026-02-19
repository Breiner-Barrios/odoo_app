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
    permission_classes = [IsAuthenticated]
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

class LeadCreateAPIView(APIView):
    permission_classes = [IsAuthenticated] # Cualquier usuario logueado puede crear

    def post(self, request):
        try:
            service = OdooService()
            # Los datos vienen del cuerpo de la petición de Angular
            new_id = service.create_lead(request.data)
            return Response({"id": new_id, "message": "Lead creado"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LeadUpdateAPIView(APIView):
    # Ya verificamos que IsAuthenticated es suficiente para tu entorno actual
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        data = request.data
        # Mapeamos los campos para asegurarnos de que Odoo los entienda
        vals = {
            'name': data.get('name'),
            'expected_revenue': float(data.get('planned_revenue', 0)),
            'probability': float(data.get('probability', 0)),
            'contact_name': data.get('contact_name'),
            'email_from': data.get('email_from'),
            'phone': data.get('phone'),
        }
        
        # Filtramos valores nulos para no sobreescribir con vacíos si no es necesario
        vals = {k: v for k, v in vals.items() if v is not None}

        service = OdooService()
        success = service.update_lead(pk, vals)

        if success:
            return Response({"message": "Lead actualizado en Odoo"}, status=status.HTTP_200_OK)
        return Response({"error": "No se pudo actualizar en Odoo"}, status=status.HTTP_400_BAD_REQUEST)

class LeadDeleteAPIView(APIView):
    # Solo el Admin puede borrar
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        try:
            service = OdooService()
            success = service.delete_lead(pk)
            if success:
                return Response({"message": "Lead eliminado"}, status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Odoo no permitió eliminar el lead"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)