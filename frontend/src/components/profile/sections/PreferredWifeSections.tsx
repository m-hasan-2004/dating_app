'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import { useTranslation } from '@/context/LanguageContext';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import MultiRecordSection from '@/components/profile/MultiRecordSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
import { formatApiError, bottomErrorMessage } from '@/utils/errorFormatter';
import type {
  PreferredWifeIntellectualInformation,
  PreferredWifePersonalInformation,
  PreferredWifePhysicalInformation,
  PreferredWifeExtraInformation,
  AppearanceTypeEnum,
  AgeDifferenceEnum,
  ImportanceEnum,
  MarriageWithExperienceEnum,
  DisabledVeteranEnum,
  FutureSpouseJobEnum,
  AfterMarriageResidenceLocationEnum,
  SkinColorEnum,
  EthnicityEnum,
} from '@/services/profileService';
import type { FutureSposeOriginality } from '@/services/profileMultiService';
import {
  createPreferredWifeIntellectualInformation,
  updatePreferredWifeIntellectualInformation,
  createPreferredWifePersonalInformation,
  updatePreferredWifePersonalInformation,
  createPreferredWifePhysicalInformation,
  updatePreferredWifePhysicalInformation,
  createPreferredWifeExtraInformation,
  updatePreferredWifeExtraInformation,
} from '@/services/profileService';
import {
  createFutureSpouseOriginality,
  updateFutureSpouseOriginality,
  deleteFutureSpouseOriginality,
} from '@/services/profileMultiService';

/* ─── Options ─────────────────────────────────────────────────────────── */

const ETHNICITY_OPTIONS: SelectOption[] = [
  'فارس', 'لر', 'ترک', 'کرد', 'لک', 'تات', 'عرب', 'بلوچ',
].map((v) => ({ value: v, label: v }));

const APPEARANCE_OPTIONS: SelectOption[] = [
  'Religious', 'Norm', 'Cador', 'Manto', 'Sport & Modern',
].map((v) => ({ value: v, label: v }));

const AGE_DIFF_OPTIONS: SelectOption[] = [
  { value: 'Same', label: 'Same' },
  { value: 'Till 3', label: 'Till 3' },
  { value: '3 to 7', label: '3 to 7' },
  { value: '7 to 10', label: '7 to 10' },
  { value: '10 to 15', label: '10 to 15' },
  { value: 'Depends on the Looks', label: 'Depends on the Looks' },
  { value: 'Doesn’t Matter', label: "Doesn't Matter" },
];

const IMPORTANCE_OPTIONS: SelectOption[] = [
  { value: 'too_much', label: 'Too Much' },
  { value: 'much', label: 'Much' },
  { value: 'any', label: 'Any / Average' },
  { value: 'low', label: 'Low' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
];

const MARRIAGE_EXP_OPTIONS: SelectOption[] = [
  'Never', 'Divorced Virgin', 'Divorced No Custody', 'Divorced No Life',
  'Divorced No Child', 'Divorced Have Boy', 'Divorced Have Girl', 'Spouse Died',
].map((v) => ({ value: v, label: v }));

const DISABLED_VETERAN_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'depends', label: 'Depends' },
];

const SPOUSE_JOB_OPTIONS: SelectOption[] = [
  { value: 'free', label: 'Freelance' },
  { value: 'military', label: 'Military' },
  { value: 'office', label: 'Office' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'hoze_m', label: 'Hoze M' },
  { value: 'hoze_n', label: 'Hoze N' },
  { value: 'hoze_s', label: 'hoze Sis' },
  { value: 'womanly', label: 'Womanly Job' },
  { value: 'no_job', label: 'No Job At All' },
  { value: 'housekeeper', label: 'Housekeeper' },
  { value: 'Doesn’t Matter', label: "Doesn't Matter" },
];

const SPOUSE_RESIDENCE_LOCATIONS: SelectOption[] = [
  'Exactly Qom', 'Near Qom', 'Mega Cities', 'Anywhere in Iran',
  'Villages Near Qom', 'Environs Near Qom', 'Foreign Country', 'Agreement',
].map((v) => ({ value: v, label: v }));

const SKIN_COLOR_OPTIONS: SelectOption[] = [
  'Very Bright', 'Bor', 'Fair', 'White', 'Wheat', 'Greenish', 'Olive',
  'Darken', 'Black', 'Bright Brown', 'Darken Brown', 'Bright', 'Yellow',
  'Whitish White', 'Red & White', 'Bright Greenish',
].map((v) => ({ value: v, label: v })).concat([
  { value: 'other', label: 'Other' },
]);

const HEIGHT_PRESETS = [
  { label: '< 160', min: '0', max: '159' },
  { label: '160 - 170', min: '160', max: '170' },
  { label: '170 - 180', min: '170', max: '180' },
  { label: '180 - 190', min: '180', max: '190' },
  { label: '190+', min: '190', max: '' },
];

const WEIGHT_PRESETS = [
  { label: '< 50', min: '0', max: '49' },
  { label: '50 - 60', min: '50', max: '60' },
  { label: '60 - 70', min: '60', max: '70' },
  { label: '70 - 85', min: '70', max: '85' },
  { label: '85 - 100', min: '85', max: '100' },
  { label: '100+', min: '100', max: '' },
];

/* ─── 1. FutureSpouseOriginalitiesSection ───────────────────────────────── */

function defaultOriginalityForm(item?: FutureSposeOriginality | null) {
  return {
    future_spouse_ethnicity: item?.future_spouse_ethnicity ?? item?.future_spouse_originality ?? ('فارس' as EthnicityEnum),
  };
}

export function FutureSpouseOriginalitiesSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: FutureSposeOriginality[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FutureSposeOriginality | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FutureSposeOriginality | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultOriginalityForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultOriginalityForm(null));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleEdit = (item: FutureSposeOriginality) => {
    setEditingItem(item);
    reset(defaultOriginalityForm(item));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleDelete = (item: FutureSposeOriginality) => {
    setItemToDelete(item);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteFutureSpouseOriginality(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setDeleteError(formatted.message || t('Failed to delete'));
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        future_spouse_originality: state.future_spouse_ethnicity,
      };
      if (editingItem?.id) {
        await updateFutureSpouseOriginality(editingItem.id, payload as any);
      } else {
        await createFutureSpouseOriginality(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <MultiRecordSection
        title="Future Spouse Originalities / Ethnicities" isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div>
            <DisplayRow label="Preferred Ethnicity" value={item.future_spouse_ethnicity ?? item.future_spouse_originality} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-md w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? t('Edit') : t('Add')} {t('Future Spouse Ethnicity')}
          </h2>
          <div className="space-y-4">
            <FormField label="Ethnicity" name="future_spouse_ethnicity" type="select" value={state.future_spouse_ethnicity} onChange={handleChange} options={ETHNICITY_OPTIONS} required error={fieldErrors.future_spouse_ethnicity || fieldErrors.future_spouse_originality} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => !deleting && setDeleteModalOpen(false)} className="max-w-md w-full">
        <div className="p-6 w-full">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t('Delete Future Spouse Ethnicity')}
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {isRTL
              ? `آیا از حذف معیار «${itemToDelete?.future_spouse_ethnicity ?? itemToDelete?.future_spouse_originality ?? ''}» اطمینان دارید؟ این عملیات غیرقابل بازگشت است.`
              : `Are you sure you want to delete "${itemToDelete?.future_spouse_ethnicity ?? itemToDelete?.future_spouse_originality ?? ''}"? This action cannot be undone.`}
          </p>
          {deleteError && (
            <p className="mt-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200 dark:border-red-800">
              {deleteError}
            </p>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleting}
              className="!bg-red-600 hover:!bg-red-700 !text-white"
            >
              {deleting ? t('Deleting...') : t('Delete')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 2. PreferredWifeIntellectualSection ──────────────────────────────── */

function defaultPrefIntellectualForm(data: PreferredWifeIntellectualInformation | null) {
  return {
    appearance_type: toArray(data?.appearance_type) as AppearanceTypeEnum[],
    age_difference: toArray(data?.age_difference) as AgeDifferenceEnum[],
    future_spouse_family_religious_status_importance: data?.future_spouse_family_religious_status_importance ?? ('' as ImportanceEnum),
    future_spouse_family_financial_status_importance: data?.future_spouse_family_financial_status_importance ?? ('' as ImportanceEnum),
    marriage_with_someone_with_marriage_experience: toArray(data?.marriage_with_someone_with_marriage_experience) as MarriageWithExperienceEnum[],
    marriage_with_someone_explanation: data?.marriage_with_someone_explanation ?? '',
    most_important_moral_feature: data?.most_important_moral_feature ?? '',
    marriage_with_disabled_person: data?.marriage_with_disabled_person ?? ('' as DisabledVeteranEnum),
    marriage_with_veteran_person: data?.marriage_with_veteran_person ?? ('' as DisabledVeteranEnum),
    marriage_disabled_veteran_explanation: data?.marriage_disabled_veteran_explanation ?? '',
    red_flags: data?.red_flags ?? '',
  };
}

export function PreferredWifeIntellectualSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: PreferredWifeIntellectualInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultPrefIntellectualForm(data));

  const openModal = () => {
    reset(defaultPrefIntellectualForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...state,
        future_spouse_family_religious_status_importance: state.future_spouse_family_religious_status_importance || null,
        future_spouse_family_financial_status_importance: state.future_spouse_family_financial_status_importance || null,
        marriage_with_disabled_person: state.marriage_with_disabled_person || null,
        marriage_with_veteran_person: state.marriage_with_veteran_person || null,
      };
      if (data?.id) {
        await updatePreferredWifeIntellectualInformation(data.id, payload as any);
      } else {
        await createPreferredWifeIntellectualInformation(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Intellectual Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Appearance Type" value={formatMultiValue(data?.appearance_type, APPEARANCE_OPTIONS, t)} />
        <DisplayRow label="Age Difference" value={formatMultiValue(data?.age_difference, AGE_DIFF_OPTIONS, t)} />
        <DisplayRow label="Family Religious Status Importance" value={data?.future_spouse_family_religious_status_importance} />
        <DisplayRow label="Family Financial Status Importance" value={data?.future_spouse_family_financial_status_importance} />
        <DisplayRow label="Marriage with Experienced" value={formatMultiValue(data?.marriage_with_someone_with_marriage_experience, MARRIAGE_EXP_OPTIONS, t)} />
        <DisplayRow label="Marriage Experience Explanation" value={data?.marriage_with_someone_explanation} />
        <DisplayRow label="Most Important Moral Feature" value={data?.most_important_moral_feature} />
        <DisplayRow label="Marriage with Disabled Person" value={data?.marriage_with_disabled_person} />
        <DisplayRow label="Marriage with Veteran" value={data?.marriage_with_veteran_person} />
        <DisplayRow label="Disabled / Veteran Explanation" value={data?.marriage_disabled_veteran_explanation} />
        <DisplayRow label="Red Flags / Don'ts" value={data?.red_flags} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Preferred Wife Intellectual Information')}
          </h2>
          <div className="space-y-4">
            <FormField label="Appearance Type" name="appearance_type" type="multiselect" value={state.appearance_type} onChange={handleChange} options={APPEARANCE_OPTIONS} error={fieldErrors.appearance_type} />
            <FormField label="Age Difference" name="age_difference" type="multiselect" value={state.age_difference} onChange={handleChange} options={AGE_DIFF_OPTIONS} error={fieldErrors.age_difference} />
            <FormField label="Family Religious Status Importance" name="future_spouse_family_religious_status_importance" type="select" value={state.future_spouse_family_religious_status_importance} onChange={handleChange} options={IMPORTANCE_OPTIONS} error={fieldErrors.future_spouse_family_religious_status_importance} />
            <FormField label="Family Financial Status Importance" name="future_spouse_family_financial_status_importance" type="select" value={state.future_spouse_family_financial_status_importance} onChange={handleChange} options={IMPORTANCE_OPTIONS} error={fieldErrors.future_spouse_family_financial_status_importance} />
            <FormField label="Marriage with Someone with Marriage Experience" name="marriage_with_someone_with_marriage_experience" type="multiselect" value={state.marriage_with_someone_with_marriage_experience} onChange={handleChange} options={MARRIAGE_EXP_OPTIONS} error={fieldErrors.marriage_with_someone_with_marriage_experience} />
            <FormField label="Marriage Experience Explanation" name="marriage_with_someone_explanation" type="textarea" value={state.marriage_with_someone_explanation} onChange={handleChange} error={fieldErrors.marriage_with_someone_explanation} />
            <FormField label="Most Important Moral Feature" name="most_important_moral_feature" type="textarea" value={state.most_important_moral_feature} onChange={handleChange} error={fieldErrors.most_important_moral_feature} />
            <FormField label="Marriage with Disabled Person" name="marriage_with_disabled_person" type="select" value={state.marriage_with_disabled_person} onChange={handleChange} options={DISABLED_VETERAN_OPTIONS} error={fieldErrors.marriage_with_disabled_person} />
            <FormField label="Marriage with Veteran Person" name="marriage_with_veteran_person" type="select" value={state.marriage_with_veteran_person} onChange={handleChange} options={DISABLED_VETERAN_OPTIONS} error={fieldErrors.marriage_with_veteran_person} />
            <FormField label="Disabled / Veteran Explanation" name="marriage_disabled_veteran_explanation" type="textarea" value={state.marriage_disabled_veteran_explanation} onChange={handleChange} error={fieldErrors.marriage_disabled_veteran_explanation} />
            <FormField label="Red Flags / Dealbreakers" name="red_flags" type="textarea" value={state.red_flags} onChange={handleChange} error={fieldErrors.red_flags} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 3. PreferredWifePersonalSection ──────────────────────────────────── */

function defaultPrefPersonalForm(data: PreferredWifePersonalInformation | null) {
  return {
    education_level: data?.education_level ?? '',
    field_of_study: data?.field_of_study ?? '',
    future_spouse_job: toArray(data?.future_spouse_job) as FutureSpouseJobEnum[],
    current_residence_location: data?.current_residence_location ?? '',
    after_marriage_residence_location: data?.after_marriage_residence_location ?? ('' as AfterMarriageResidenceLocationEnum),
  };
}

export function PreferredWifePersonalSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: PreferredWifePersonalInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultPrefPersonalForm(data));

  const openModal = () => {
    reset(defaultPrefPersonalForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...state,
        after_marriage_residence_location: state.after_marriage_residence_location || null,
      };
      if (data?.id) {
        await updatePreferredWifePersonalInformation(data.id, payload as any);
      } else {
        await createPreferredWifePersonalInformation(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Personal Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Education Level" value={data?.education_level} />
        <DisplayRow label="Field of Study" value={data?.field_of_study} />
        <DisplayRow label="Future Spouse Job" value={formatMultiValue(data?.future_spouse_job, SPOUSE_JOB_OPTIONS, t)} />
        <DisplayRow label="Current Residence Location" value={data?.current_residence_location} />
        <DisplayRow label="After Marriage Residence Location" value={data?.after_marriage_residence_location} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Preferred Wife Personal Information')}
          </h2>
          <div className="space-y-4">
            <FormField label="Education Level" name="education_level" type="text" value={state.education_level} onChange={handleChange} error={fieldErrors.education_level} />
            <FormField label="Field of Study" name="field_of_study" type="text" value={state.field_of_study} onChange={handleChange} error={fieldErrors.field_of_study} />
            <FormField label="Future Spouse Job" name="future_spouse_job" type="multiselect" value={state.future_spouse_job} onChange={handleChange} options={SPOUSE_JOB_OPTIONS} error={fieldErrors.future_spouse_job} />
            <FormField label="Current Residence Location" name="current_residence_location" type="text" value={state.current_residence_location} onChange={handleChange} error={fieldErrors.current_residence_location} />
            <FormField label="After Marriage Residence Location" name="after_marriage_residence_location" type="select" value={state.after_marriage_residence_location} onChange={handleChange} options={SPOUSE_RESIDENCE_LOCATIONS} error={fieldErrors.after_marriage_residence_location} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 4. PreferredWifePhysicalSection ──────────────────────────────────── */

function defaultPrefPhysicalForm(data: PreferredWifePhysicalInformation | null) {
  return {
    height_min: data?.height_min ?? '',
    height_max: data?.height_max ?? '',
    weight_min: data?.weight_min ?? '',
    weight_max: data?.weight_max ?? '',
    skin_color: toArray(data?.skin_color) as SkinColorEnum[],
  };
}

export function PreferredWifePhysicalSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: PreferredWifePhysicalInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultPrefPhysicalForm(data));

  const openModal = () => {
    reset(defaultPrefPhysicalForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      const payload = {
        ...state,
        height_min: state.height_min ? Number(state.height_min) : null,
        height_max: state.height_max ? Number(state.height_max) : null,
        weight_min: state.weight_min ? Number(state.weight_min) : null,
        weight_max: state.weight_max ? Number(state.weight_max) : null,
      };
      if (data?.id) {
        await updatePreferredWifePhysicalInformation(data.id, payload as any);
      } else {
        await createPreferredWifePhysicalInformation(payload as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Physical Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow
          label="Height Range"
          value={
            data?.height_min || data?.height_max
              ? `${data.height_min ?? '—'} ${isRTL ? 'تا' : 'to'} ${data.height_max ?? '—'} ${isRTL ? 'سانتی‌متر' : 'cm'}`
              : null
          }
        />
        <DisplayRow
          label="Weight Range"
          value={
            data?.weight_min || data?.weight_max
              ? `${data.weight_min ?? '—'} ${isRTL ? 'تا' : 'to'} ${data.weight_max ?? '—'} ${isRTL ? 'کیلوگرم' : 'kg'}`
              : null
          }
        />
        <DisplayRow label="Preferred Skin Color" value={formatMultiValue(data?.skin_color, SKIN_COLOR_OPTIONS, t)} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Preferred Wife Physical Information')}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Min Height (cm)" name="height_min" type="number" value={state.height_min} onChange={handleChange} error={fieldErrors.height_min} />
                <FormField label="Max Height (cm)" name="height_max" type="number" value={state.height_max} onChange={handleChange} error={fieldErrors.height_max} />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {HEIGHT_PRESETS.map((p) => {
                  const active = String(state.height_min || '') === p.min && String(state.height_max || '') === p.max;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        if (active) {
                          handleChange('height_min', '');
                          handleChange('height_max', '');
                        } else {
                          handleChange('height_min', p.min);
                          handleChange('height_max', p.max);
                        }
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors border ${
                        active
                          ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-300 ring-1 ring-brand-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Min Weight (kg)" name="weight_min" type="number" value={state.weight_min} onChange={handleChange} error={fieldErrors.weight_min} />
                <FormField label="Max Weight (kg)" name="weight_max" type="number" value={state.weight_max} onChange={handleChange} error={fieldErrors.weight_max} />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1.5">
                {WEIGHT_PRESETS.map((p) => {
                  const active = String(state.weight_min || '') === p.min && String(state.weight_max || '') === p.max;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        if (active) {
                          handleChange('weight_min', '');
                          handleChange('weight_max', '');
                        } else {
                          handleChange('weight_min', p.min);
                          handleChange('weight_max', p.max);
                        }
                      }}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors border ${
                        active
                          ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-950/40 dark:border-brand-500 dark:text-brand-300 ring-1 ring-brand-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <FormField label="Preferred Skin Colors" name="skin_color" type="multiselect" value={state.skin_color} onChange={handleChange} options={SKIN_COLOR_OPTIONS} error={fieldErrors.skin_color} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── 5. PreferredWifeExtraSection ─────────────────────────────────────── */

function defaultPrefExtraForm(data: PreferredWifeExtraInformation | null) {
  return {
    additional_explanations: data?.additional_explanations ?? '',
  };
}

export function PreferredWifeExtraSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: PreferredWifeExtraInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset, fieldErrors, setFieldErrors } = useFormState(defaultPrefExtraForm(data));

  const openModal = () => {
    reset(defaultPrefExtraForm(data));
    setError('');
    setFieldErrors({});
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setFieldErrors({});
    try {
      if (data?.id) {
        await updatePreferredWifeExtraInformation(data.id, state as any);
      } else {
        await createPreferredWifeExtraInformation(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      const formatted = formatApiError(e, t, isRTL);
      setFieldErrors(formatted.fieldErrors);
      setError(bottomErrorMessage(formatted, t));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Extra Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Additional Explanations" value={data?.additional_explanations} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-lg w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? t('Edit') : t('Add')} {t('Preferred Wife Extra Information')}
          </h2>
          <div className="space-y-4">
            <FormField label="Additional Explanations" name="additional_explanations" type="textarea" value={state.additional_explanations} onChange={handleChange} rows={5} error={fieldErrors.additional_explanations} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>{t('Cancel')}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t('Saving...') : t('Save')}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}