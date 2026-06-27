"""
Custom admin list filters with correct multi-select behaviour.

Two independent filter classes (not inheriting from the
``django_admin_multi_select_filter`` package, which has a comma-join bug):

* :class:`MultiSelectChoicesListFilter` -- for ``CharField`` / ``IntegerField``
  columns that have ``choices`` and store **one** value per row.  Uses
  ``field__in=[v1, v2, ...]`` (match any selected option).

* :class:`MultiSelectCSVFieldListFilter` -- for ``MultiSelectField`` columns
  (CSV-stored, e.g. ``"house,car,gold"``).  Uses a regex lookup
  ``(^|,)value(,|$)`` so each selected option matches as a whole CSV token,
  never as a substring of another token (``"Man"`` must not match
  ``"Woman"``).

Both classes use ``field.choices`` (the model's defined choices) for the
sidebar options -- **not** ``values_list()`` from the database -- so every
defined option is always visible even when no record uses it yet, and
``MultiSelectField`` columns show individual options instead of combined CSV
strings.
"""

from django.contrib.admin.filters import FieldListFilter
from django.db.models import Q
from django.utils.translation import gettext_lazy as _


class _BaseMultiSelectFilter(FieldListFilter):
    """
    Base class for multi-select filters.

    Sets ``lookup_kwarg = field_path + "__in"`` so that Django's
    :func:`prepare_lookup_value` automatically splits the comma-joined URL
    value into a real list.  Filter options come from ``field.choices`` (the
    model's defined choices), not from database values, so every option is
    always visible.
    """

    def __init__(self, field, request, params, model, model_admin, field_path):
        self.lookup_kwarg = field_path + "__in"
        self.lookup_kwarg_isnull = field_path + "__isnull"
        super().__init__(field, request, params, model, model_admin, field_path)
        self.lookup_val = self.used_parameters.get(self.lookup_kwarg, [])
        self.lookup_val_isnull = self.used_parameters.get(
            self.lookup_kwarg_isnull
        )
        if isinstance(self.lookup_val, str):
            self.lookup_val = [
                v.strip() for v in self.lookup_val.split(",") if v.strip()
            ]
        self._choice_labels = {}
        if field.choices:
            self._choice_labels = {
                str(val): str(label) for val, label in field.choices
            }

    def expected_parameters(self):
        return [self.lookup_kwarg, self.lookup_kwarg_isnull]

    def has_output(self):
        return len(self._choice_labels) > 0

    def choices(self, changelist):
        yield {
            "selected": not self.lookup_val and not self.lookup_val_isnull,
            "query_string": changelist.get_query_string(
                remove=[self.lookup_kwarg, self.lookup_kwarg_isnull]
            ),
            "display": _("All"),
        }
        for val, label in self.field.choices:
            val = str(val)
            if val in self.lookup_val:
                remaining = [v for v in self.lookup_val if v != val]
            else:
                remaining = self.lookup_val + [val]
            if remaining:
                yield {
                    "selected": val in self.lookup_val,
                    "query_string": changelist.get_query_string(
                        {self.lookup_kwarg: ",".join(remaining)},
                        [self.lookup_kwarg_isnull],
                    ),
                    "display": str(label),
                }
            else:
                yield {
                    "selected": val in self.lookup_val,
                    "query_string": changelist.get_query_string(
                        remove=[self.lookup_kwarg]
                    ),
                    "display": str(label),
                }


class MultiSelectChoicesListFilter(_BaseMultiSelectFilter):
    """
    Multi-select filter for columns that store a **single** value per row
    (``CharField`` / ``IntegerField`` with ``choices``).

    Selecting several options returns rows whose value matches *any* of them
    via ``field__in=[v1, v2, ...]``.
    """

    def queryset(self, request, queryset):
        if not self.lookup_val:
            return queryset
        return queryset.filter(**{self.lookup_kwarg: self.lookup_val})


class MultiSelectCSVFieldListFilter(_BaseMultiSelectFilter):
    """
    Multi-select filter for ``MultiSelectField`` columns.

    ``MultiSelectField`` serialises values into a comma-separated string
    (e.g. ``"house,car,gold"``), so ``field__in`` never matches.  This filter
    uses a POSIX regex ``(^|,)value(,|$)`` so each selected option matches as
    a whole CSV token.  This also prevents false positives (``"Man"`` does not
    match ``"Woman"``).
    """

    def queryset(self, request, queryset):
        if not self.lookup_val:
            return queryset
        queries = [
            Q(**{f"{self.field_path}__regex": rf"(^|,){value}(,|$)"})
            for value in self.lookup_val
        ]
        query = queries[0]
        for q in queries[1:]:
            query = query | q
        return queryset.filter(query)


class FatherOriginalityFilter(MultiSelectChoicesListFilter):
    """
    Multi-select filter for the father's ``originality`` (Iranian province /
    ethnicity).

    Both ``Father.originality`` and ``Mother.originality`` inherit the same
    field (verbose name "Originality"), so the sidebar showed two
    indistinguishable filters. This subclass overrides the sidebar title to
    the Persian "اصالت پدر" (Father's Originality).
    """

    def __init__(self, field, request, params, model, model_admin, field_path):
        super().__init__(field, request, params, model, model_admin, field_path)
        self.title = _("اصالت پدر")


class MotherOriginalityFilter(MultiSelectChoicesListFilter):
    """
    Multi-select filter for the mother's ``originality`` (Iranian province /
    ethnicity).

    Sets the sidebar title to the Persian "اصالت مادر" (Mother's Originality)
    so it is distinguishable from the father's originality filter.
    """

    def __init__(self, field, request, params, model, model_admin, field_path):
        super().__init__(field, request, params, model, model_admin, field_path)
        self.title = _("اصالت مادر")

