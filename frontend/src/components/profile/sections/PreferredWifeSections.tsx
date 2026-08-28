'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import MultiRecordSection from '@/components/profile/MultiRecordSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
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
  'Same', 'Till 3', '3 to 7', '7 to 10', '10 to 15', 'Depends on the Looks', "Doesn't Matter",
].map((v) => ({ value: v, label: v }));

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
  'Freelance', 'Military', 'Office', 'Teacher', 'Hoze M', 'Hoze N', 'hoze Sis',
  'Womanly Job', 'No Job At All', 'Housekeeper', "Doesn't Matter",
].map((v) => ({ value: v, label: v }));

const SPOUSE_RESIDENCE_LOCATIONS: SelectOption[] = [
  'Exactly Qom', 'Near Qom', 'Mega Cities', 'Anywhere in Iran',
  'Villages Near Qom', 'Environs Near Qom', 'Foreign Country', 'Agreement',
].map((v) => ({ value: v, label: v }));

const SKIN_COLOR_OPTIONS: SelectOption[] = [
  'Very Bright', 'Bor', 'Fair', 'White', 'Wheat', 'Greenish', 'Olive',
  'Darken', 'Black', 'Bright Brown', 'Darken Brown', 'Bright', 'Yellow',
  'Whitish White', 'Red & White', 'Bright Greenish', 'Other',
].map((v) => ({ value: v, label: v }));

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
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FutureSposeOriginality | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultOriginalityForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultOriginalityForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: FutureSposeOriginality) => {
    setEditingItem(item);
    reset(defaultOriginalityForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: FutureSposeOriginality) => {
    if (!confirm('Are you sure you want to delete this originality preference?')) return;
    try {
      await deleteFutureSpouseOriginality(item.id);
      onReload();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
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
      setError(e?.message ?? 'Failed to save');
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
            {editingItem ? 'Edit' : 'Add'} Future Spouse Ethnicity
          </h2>
          <div className="space-y-4">
            <FormField label="Ethnicity" name="future_spouse_ethnicity" type="select" value={state.future_spouse_ethnicity} onChange={handleChange} options={ETHNICITY_OPTIONS} required />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
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
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPrefIntellectualForm(data));

  const openModal = () => {
    reset(defaultPrefIntellectualForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
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
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Intellectual Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Appearance Type" value={formatMultiValue(data?.appearance_type, APPEARANCE_OPTIONS)} />
        <DisplayRow label="Age Difference" value={formatMultiValue(data?.age_difference, AGE_DIFF_OPTIONS)} />
        <DisplayRow label="Family Religious Status Importance" value={data?.future_spouse_family_religious_status_importance} />
        <DisplayRow label="Family Financial Status Importance" value={data?.future_spouse_family_financial_status_importance} />
        <DisplayRow label="Marriage with Experienced" value={formatMultiValue(data?.marriage_with_someone_with_marriage_experience, MARRIAGE_EXP_OPTIONS)} />
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
            {data ? 'Edit' : 'Add'} Preferred Wife Intellectual Information
          </h2>
          <div className="space-y-4">
            <FormField label="Appearance Type" name="appearance_type" type="multiselect" value={state.appearance_type} onChange={handleChange} options={APPEARANCE_OPTIONS} />
            <FormField label="Age Difference" name="age_difference" type="multiselect" value={state.age_difference} onChange={handleChange} options={AGE_DIFF_OPTIONS} />
            <FormField label="Family Religious Status Importance" name="future_spouse_family_religious_status_importance" type="select" value={state.future_spouse_family_religious_status_importance} onChange={handleChange} options={IMPORTANCE_OPTIONS} />
            <FormField label="Family Financial Status Importance" name="future_spouse_family_financial_status_importance" type="select" value={state.future_spouse_family_financial_status_importance} onChange={handleChange} options={IMPORTANCE_OPTIONS} />
            <FormField label="Marriage with Someone with Marriage Experience" name="marriage_with_someone_with_marriage_experience" type="multiselect" value={state.marriage_with_someone_with_marriage_experience} onChange={handleChange} options={MARRIAGE_EXP_OPTIONS} />
            <FormField label="Marriage Experience Explanation" name="marriage_with_someone_explanation" type="textarea" value={state.marriage_with_someone_explanation} onChange={handleChange} />
            <FormField label="Most Important Moral Feature" name="most_important_moral_feature" type="textarea" value={state.most_important_moral_feature} onChange={handleChange} />
            <FormField label="Marriage with Disabled Person" name="marriage_with_disabled_person" type="select" value={state.marriage_with_disabled_person} onChange={handleChange} options={DISABLED_VETERAN_OPTIONS} />
            <FormField label="Marriage with Veteran Person" name="marriage_with_veteran_person" type="select" value={state.marriage_with_veteran_person} onChange={handleChange} options={DISABLED_VETERAN_OPTIONS} />
            <FormField label="Disabled / Veteran Explanation" name="marriage_disabled_veteran_explanation" type="textarea" value={state.marriage_disabled_veteran_explanation} onChange={handleChange} />
            <FormField label="Red Flags / Dealbreakers" name="red_flags" type="textarea" value={state.red_flags} onChange={handleChange} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
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
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPrefPersonalForm(data));

  const openModal = () => {
    reset(defaultPrefPersonalForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
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
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Personal Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Education Level" value={data?.education_level} />
        <DisplayRow label="Field of Study" value={data?.field_of_study} />
        <DisplayRow label="Future Spouse Job" value={formatMultiValue(data?.future_spouse_job, SPOUSE_JOB_OPTIONS)} />
        <DisplayRow label="Current Residence Location" value={data?.current_residence_location} />
        <DisplayRow label="After Marriage Residence Location" value={data?.after_marriage_residence_location} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Preferred Wife Personal Information
          </h2>
          <div className="space-y-4">
            <FormField label="Education Level" name="education_level" type="text" value={state.education_level} onChange={handleChange} />
            <FormField label="Field of Study" name="field_of_study" type="text" value={state.field_of_study} onChange={handleChange} />
            <FormField label="Future Spouse Job" name="future_spouse_job" type="multiselect" value={state.future_spouse_job} onChange={handleChange} options={SPOUSE_JOB_OPTIONS} />
            <FormField label="Current Residence Location" name="current_residence_location" type="text" value={state.current_residence_location} onChange={handleChange} />
            <FormField label="After Marriage Residence Location" name="after_marriage_residence_location" type="select" value={state.after_marriage_residence_location} onChange={handleChange} options={SPOUSE_RESIDENCE_LOCATIONS} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
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
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPrefPhysicalForm(data));

  const openModal = () => {
    reset(defaultPrefPhysicalForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
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
      setError(e?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ProfileSection title="Preferred Wife Physical Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow
          label="Height Range"
          value={data?.height_min || data?.height_max ? `${data.height_min ?? '—'} to ${data.height_max ?? '—'} cm` : null}
        />
        <DisplayRow
          label="Weight Range"
          value={data?.weight_min || data?.weight_max ? `${data.weight_min ?? '—'} to ${data.weight_max ?? '—'} kg` : null}
        />
        <DisplayRow label="Preferred Skin Color" value={formatMultiValue(data?.skin_color, SKIN_COLOR_OPTIONS)} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Preferred Wife Physical Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Min Height (cm)" name="height_min" type="number" value={state.height_min} onChange={handleChange} />
              <FormField label="Max Height (cm)" name="height_max" type="number" value={state.height_max} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Min Weight (kg)" name="weight_min" type="number" value={state.weight_min} onChange={handleChange} />
              <FormField label="Max Weight (kg)" name="weight_max" type="number" value={state.weight_max} onChange={handleChange} />
            </div>
            <FormField label="Preferred Skin Colors" name="skin_color" type="multiselect" value={state.skin_color} onChange={handleChange} options={SKIN_COLOR_OPTIONS} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
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
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultPrefExtraForm(data));

  const openModal = () => {
    reset(defaultPrefExtraForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (data?.id) {
        await updatePreferredWifeExtraInformation(data.id, state as any);
      } else {
        await createPreferredWifeExtraInformation(state as any);
      }
      setOpen(false);
      onReload();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
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
            {data ? 'Edit' : 'Add'} Preferred Wife Extra Information
          </h2>
          <div className="space-y-4">
            <FormField label="Additional Explanations" name="additional_explanations" type="textarea" value={state.additional_explanations} onChange={handleChange} rows={5} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}