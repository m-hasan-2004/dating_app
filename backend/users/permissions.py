"""
Custom permission classes for the Dating App API.

These enforce **object-level** authorization on top of DRF's global
``IsAuthenticated`` so that:

* A regular user can read / edit only their own record and own profile data.
* Staff/admin users retain full access to all objects for management.
"""

from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Object-level permission.

    * ``True`` for safe methods (GET, HEAD, OPTIONS) when the requester is the
      owner of the object or an admin/staff.
    * ``True`` for write methods (PUT, PATCH, DELETE) when the requester is the
      owner of the object or an admin/staff.

    The owner is determined by comparing ``obj`` to ``request.user``. For
    related profile models this requires the object to expose a ``user``
    relation; for the ``User`` model itself the object *is* the user.
    """

    def has_permission(self, request, view):
        # Must be authenticated for all non-unsafe methods; object-level check
        # happens in has_object_permission. For list endpoints the queryset is
        # already scoped in the view, so we allow authenticated users here.
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Admins / staff can do everything.
        if request.user and (request.user.is_staff or request.user.is_superuser):
            return True

        # The User model is its own owner.
        if obj == request.user:
            return True

        # Profile models expose a ``user`` FK.
        owner = getattr(obj, "user", None)
        return owner == request.user


class IsOwner(permissions.BasePermission):
    """
    Stricter variant: only the owner can access the object, admins included
    only if they are also the owner. Used for highly personal profile data.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        if obj == request.user:
            return True
        owner = getattr(obj, "user", None)
        return owner == request.user