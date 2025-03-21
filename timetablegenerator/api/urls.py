from django.urls import path
from .views import register_user, login_user, logout_user, get_user_details,admin_login,admin_details
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', logout_user, name='logout'),
    path('user/', get_user_details, name='user-details'),
    path('admin/login/',admin_login,name='admin-login'),
    path('admin/details/',admin_details,name='admin-details'),
    # JWT Token Refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

