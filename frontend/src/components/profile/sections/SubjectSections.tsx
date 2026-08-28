'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import MultiRecordSection from '@/components/profile/MultiRecordSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import type { SubjectDetails, SignupFeeTypeEnum } from '@/services/profileService';
import type { IntroducedSubjectsInformation } from '@/services/profileMultiService';
import { createSubjectDetails, updateSubjectDetails } from '@/services/profileService';
import {
  createIntroducedSubjectsInformation,
  updateIntroducedSubjectsInformation,
  deleteIntroducedSubjectsInformation,
} from '@/services/profileMultiService';

const FEE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card (Card to Card)' },
];

/* ─── 1. IntroducedSubjectsSection ─────────────────────────────────────── */

function defaultIntroducedForm(item?: IntroducedSubjectsInformation | null) {
  return {
    username: item?.username ?? '',
    birth_date: item?.birth_date ?? '',
    positive: item?.positive ?? item?.postive ?? false,
    negative: item?.negative ?? false,
    reason: item?.reason ?? '',
    dates_of_meetings: item?.dates_of_meetings ?? '',
    result_regards: item?.result_regards ?? item?.result_and_regards ?? '',
    cost_of_introduction: item?.cost_of_introduction ?? '',
    cost_of_meeting: item?.cost_of_meeting ?? '',
  };
}

export function IntroducedSubjectsSection({
  records,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  records: IntroducedSubjectsInformation[];
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IntroducedSubjectsInformation | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultIntroducedForm(null));

  const handleAdd = () => {
    setEditingItem(null);
    reset(defaultIntroducedForm(null));
    setError('');
    setOpen(true);
  };

  const handleEdit = (item: IntroducedSubjectsInformation) => {
    setEditingItem(item);
    reset(defaultIntroducedForm(item));
    setError('');
    setOpen(true);
  };

  const handleDelete = async (item: IntroducedSubjectsInformation) => {
    if (!confirm('Are you sure you want to delete this introduced subject?')) return;
    try {
      await deleteIntroducedSubjectsInformation(item.id);
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
        username: state.username,
        birth_date: state.birth_date || null,
        postive: state.positive,
        negative: state.negative,
        reason: state.reason,
        dates_of_meetings: state.dates_of_meetings,
        result_and_regards: state.result_regards,
        cost_of_introduction: String(state.cost_of_introduction),
        cost_of_meeting: String(state.cost_of_meeting),
      };
      if (editingItem?.id) {
        await updateIntroducedSubjectsInformation(editingItem.id, payload as any);
      } else {
        await createIntroducedSubjectsInformation(payload as any);
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
        title="Introduced Subjects"
        isCollapsed={isCollapsed}
        onToggleCollapse={onToggleCollapse}
        records={records}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        renderRecord={(item) => (
          <div className="space-y-1">
            <DisplayRow label="Username" value={item.username} />
            <DisplayRow label="Birth Date" value={item.birth_date} />
            <DisplayRow
              label="Evaluation"
              value={
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded font-medium ${item.postive ?? item.positive ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' : 'bg-gray-100 text-gray-500'}`}>
                    Positive
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded font-medium ${item.negative ? 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300' : 'bg-gray-100 text-gray-500'}`}>
                    Negative
                  </span>
                </div>
              }
            />
            <DisplayRow label="Reason" value={item.reason} />
            <DisplayRow label="Dates of Meetings" value={item.dates_of_meetings} />
            <DisplayRow label="Result & Regards" value={item.result_and_regards ?? item.result_regards} />
            <DisplayRow label="Cost of Introduction" value={item.cost_of_introduction} />
            <DisplayRow label="Cost of Meeting" value={item.cost_of_meeting} />
          </div>
        )}
      />

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {editingItem ? 'Edit' : 'Add'} Introduced Subject
          </h2>
          <div className="space-y-4">
            <FormField label="Username" name="username" type="text" value={state.username} onChange={handleChange} required />
            <FormField label="Birth Date" name="birth_date" type="date" value={state.birth_date} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Positive Assessment" name="positive" type="boolean" value={state.positive} onChange={handleChange} />
              <FormField label="Negative Assessment" name="negative" type="boolean" value={state.negative} onChange={handleChange} />
            </div>
            <FormField label="Reason" name="reason" type="textarea" value={state.reason} onChange={handleChange} />
            <FormField label="Dates of Meetings" name="dates_of_meetings" type="textarea" value={state.dates_of_meetings} onChange={handleChange} />
            <FormField label="Result & Regards" name="result_regards" type="textarea" value={state.result_regards} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Cost of Introduction" name="cost_of_introduction" type="text" value={state.cost_of_introduction} onChange={handleChange} />
              <FormField label="Cost of Meeting" name="cost_of_meeting" type="text" value={state.cost_of_meeting} onChange={handleChange} />
            </div>
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

/* ─── 2. SubjectDetailsSection ─────────────────────────────────────────── */

function defaultSubjectDetailsForm(data: SubjectDetails | null) {
  return {
    preferred_date_times: data?.preferred_date_times ?? '',
    signup_fee_type: data?.signup_fee_type ?? ('' as SignupFeeTypeEnum),
    account_number: data?.account_number ?? '',
    bank_name: data?.bank_name ?? data?.bank ?? '',
    gender_target: data?.gender_target ?? '',
    amount: data?.amount ?? '',
    professional_opinion: data?.professional_opinion ?? '',
  };
}

export function SubjectDetailsSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: SubjectDetails | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultSubjectDetailsForm(data));

  const openModal = () => {
    reset(defaultSubjectDetailsForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        bank: state.bank_name || null,
        signup_fee_type: state.signup_fee_type || null,
      };
      if (data?.id) {
        await updateSubjectDetails(data.id, payload as any);
      } else {
        await createSubjectDetails(payload as any);
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
      <ProfileSection title="Subject Details" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Preferred Date / Times" value={data?.preferred_date_times} />
        <DisplayRow label="Signup Fee Type" value={data?.signup_fee_type === 'cash' ? 'Cash' : data?.signup_fee_type === 'card' ? 'Card' : data?.signup_fee_type} />
        <DisplayRow label="Account / Card Number" value={data?.account_number} />
        <DisplayRow label="Bank Name" value={data?.bank_name ?? data?.bank} />
        <DisplayRow label="Target Gender" value={data?.gender_target} />
        <DisplayRow label="Fee Amount" value={data?.amount} />
        <DisplayRow label="Professional Opinion" value={data?.professional_opinion} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Subject Details
          </h2>
          <div className="space-y-4">
            <FormField label="Preferred Dates and Times" name="preferred_date_times" type="textarea" value={state.preferred_date_times} onChange={handleChange} />
            <FormField label="Signup Fee Type" name="signup_fee_type" type="select" value={state.signup_fee_type} onChange={handleChange} options={FEE_TYPE_OPTIONS} />
            {state.signup_fee_type === 'card' && (
              <FormField label="Account / Card Number" name="account_number" type="text" value={state.account_number} onChange={handleChange} />
            )}
            <FormField label="Bank Name" name="bank_name" type="text" value={state.bank_name} onChange={handleChange} />
            <FormField label="Target Gender" name="gender_target" type="text" value={state.gender_target} onChange={handleChange} />
            <FormField label="Fee Amount" name="amount" type="text" value={state.amount} onChange={handleChange} />
            <FormField label="Professional Opinion" name="professional_opinion" type="textarea" value={state.professional_opinion} onChange={handleChange} />
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