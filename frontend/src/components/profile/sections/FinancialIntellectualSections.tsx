'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import ProfileSection from '@/components/profile/ProfileSection';
import DisplayRow from '@/components/profile/DisplayRow';
import FormField, { useFormState, SelectOption } from '@/components/profile/FormField';
import { toArray, formatMultiValue } from '@/components/profile/profileUtils';
import type {
  FinancialInformation,
  IntellectualInformation,
  CurrentResidenceStatusEnum,
  OwnershipStatusEnum,
  AssetsEnum,
  AfterMarriageResidenceStatusEnum,
  ExSpouseFinancialStatusEnum,
  ExSpouseFinancialPayStatusEnum,
  DowryTypeEnum,
  JahiziyehEnum,
  WomanJobOpinionEnum,
  WomanEducationOpinionEnum,
  FriendConnectionEnum,
  VelayatFaqihEnum,
  ChildQuantityEnum,
  ContractHowEnum,
  WeddingHowEnum,
  WorshipAndPrayerEnum,
  FastingEnum,
  CoverTypeHouseEnum,
  CoverTypeSocietyEnum,
  ParticipationEnum,
  MusicEnum,
  DanceSingingEnum,
  InnocentContactEnum,
  CoverTypeInnocentContactEnum,
  DecisionMakingEnum,
} from '@/services/profileService';
import {
  createFinancialInformation,
  updateFinancialInformation,
  createIntellectualInformation,
  updateIntellectualInformation,
} from '@/services/profileService';

/* ─── Financial Options ────────────────────────────────────────────────── */

const RESIDENCE_OPTIONS: SelectOption[] = [
  { value: 'fathers_house', label: "Father's House" },
  { value: 'mothers_house', label: "Mother's House" },
  { value: 'other', label: 'Other' },
];

const OWNERSHIP_OPTIONS: SelectOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'rent', label: 'Rent' },
];

const ASSETS_OPTIONS: SelectOption[] = [
  { value: 'house', label: 'House' },
  { value: 'shop', label: 'Shop' },
  { value: 'land', label: 'Land' },
  { value: 'garden', label: 'Garden' },
  { value: 'factory', label: 'Factory' },
  { value: 'company', label: 'Company' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'car', label: 'Car' },
  { value: 'gold', label: 'Gold' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'None' },
];

const AFTER_MARRIAGE_RESIDENCE_OPTIONS: SelectOption[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'fathers_house', label: "Father's House" },
  { value: 'mothers_house', label: "Mother's House" },
  { value: 'other', label: 'Other' },
];

const EX_SPOUSE_FIN_OPTIONS: SelectOption[] = [
  { value: 'rights', label: 'Rights' },
  { value: 'settled', label: 'Settled' },
  { value: 'creditor', label: 'Creditor' },
  { value: 'debtor', label: 'Debtor' },
  { value: 'female', label: 'Female' },
];

const EX_SPOUSE_PAY_OPTIONS: SelectOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'two_years', label: 'Every Two Years' },
];

const DOWRY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'mecca', label: 'Mecca Pilgrimage' },
  { value: 'iraq', label: 'Iraq (Karbala)' },
  { value: 'syria', label: 'Syria (Zainab)' },
  { value: 'gold', label: 'Gold / Coins' },
  { value: 'money', label: 'Cash / Money' },
  { value: 'land', label: 'Land' },
  { value: 'car', label: 'Car' },
  { value: 'garden', label: 'Garden' },
  { value: 'house', label: 'House / Apartment' },
  { value: 'agreement', label: 'Mutual Agreement' },
];

const JAHIZIYEH_OPTIONS: SelectOption[] = [
  { value: 'does', label: 'Does Bring' },
  { value: 'doesnt', label: 'Does Not Bring' },
  { value: 'wants', label: 'Wants Jahiziyeh' },
  { value: 'doesnt_want', label: 'Does Not Want Jahiziyeh' },
  { value: 'man_should_help', label: 'Man Should Help' },
  { value: 'agreement', label: 'By Agreement' },
];

/* ─── Intellectual Options ─────────────────────────────────────────────── */

const WOMAN_JOB_OPTIONS: SelectOption[] = [
  'Disagree', 'Agree', 'Must have a job', 'Depends on Work Environment',
  'Depends on Job Type', 'Womanly Job', 'Housejob', 'Depends On Spouse Opinion',
].map((v) => ({ value: v, label: v }));

const WOMAN_EDU_OPTIONS: SelectOption[] = [
  'Disagree', 'Agree', 'Depends on the Degree', 'Depends On Spouse Opinion',
].map((v) => ({ value: v, label: v }));

const FRIEND_CONN_OPTIONS: SelectOption[] = [
  'Excellent', 'Good', 'Average', 'Weak', 'None',
].map((v) => ({ value: v, label: v }));

const VELAYAT_FAQIH_OPTIONS: SelectOption[] = [
  { value: 'agree', label: 'Agree' },
  { value: 'no_opinion', label: 'No Opinion' },
];

const CHILD_QTY_OPTIONS: SelectOption[] = [
  { value: 'dont_want', label: "Don't Want" },
  { value: 'depends', label: 'Depends' },
  { value: '1', label: '1 Child' },
  { value: '2', label: '2 Children' },
  { value: '3', label: '3 Children' },
  { value: 'more_than_3', label: 'More than 3' },
  { value: 'agreement', label: 'By Agreement' },
];

const CONTRACT_HOW_OPTIONS: SelectOption[] = [
  { value: 'registry', label: 'Registry Office' },
  { value: 'house_family', label: 'House / Family' },
  { value: 'hall', label: 'Hall / Salon' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'agreement', label: 'By Agreement' },
];

const WEDDING_HOW_OPTIONS: SelectOption[] = [
  { value: 'house_family', label: 'House / Family' },
  { value: 'hall', label: 'Hall / Salon' },
  { value: 'pilgrimage_trip', label: 'Pilgrimage Trip' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'agreement', label: 'By Agreement' },
];

const WORSHIP_OPTIONS: SelectOption[] = [
  { value: 'fully_obligated', label: 'Fully Obligated' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'not_obligated', label: 'Not Obligated' },
  { value: 'obligated_but_lazy', label: 'Obligated But Lazy' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'disagree', label: 'Disagree' },
];

const FASTING_OPTIONS: SelectOption[] = [
  { value: 'fully_obligated', label: 'Fully Obligated' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'not_obligated', label: 'Not Obligated' },
  { value: 'obligated_but_lazy', label: 'Obligated But Lazy' },
  { value: 'disagree', label: 'Disagree' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'sick', label: 'Sick / Excused' },
];

const COVER_HOUSE_OPTIONS: SelectOption[] = [
  { value: 'cozy_attractive', label: 'Cozy & Attractive' },
  { value: 'normal', label: 'Normal' },
];

const COVER_SOCIETY_OPTIONS: SelectOption[] = [
  { value: 'always_chador', label: 'Always Chador' },
  { value: 'always_coverd_manto', label: 'Always Covered Manto' },
  { value: 'always_free_manto', label: 'Always Free Manto' },
  { value: 'sometimes_chador', label: 'Sometimes Chador' },
  { value: 'sometimes_coverd_manto', label: 'Sometimes Covered Manto' },
  { value: 'sometimes_free_manto', label: 'Sometimes Free Manto' },
];

const PARTICIPATION_OPTIONS: SelectOption[] = [
  { value: 'too_much', label: 'Too Much' },
  { value: 'much', label: 'Much' },
  { value: 'average', label: 'Average' },
  { value: 'low', label: 'Low' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
];

const MUSIC_OPTIONS: SelectOption[] = [
  { value: 'too_much', label: 'Too Much' },
  { value: 'much', label: 'Much' },
  { value: 'average', label: 'Average' },
  { value: 'low', label: 'Low' },
  { value: 'never', label: 'Never' },
];

const INNOCENT_CONTACT_OPTIONS: SelectOption[] = [
  { value: 'daily_matters', label: 'Daily Matters' },
  { value: 'work_matters', label: 'Work Matters' },
  { value: 'doesnt_matter', label: "Doesn't Matter" },
];

const COVER_INNOCENT_OPTIONS: SelectOption[] = [
  { value: 'only_chador', label: 'Only Chador' },
  { value: 'formal_manto', label: 'Formal Manto' },
  { value: 'colored_chador', label: 'Colored Chador' },
  { value: 'cozy_attractive', label: 'Cozy & Attractive' },
];

const DECISION_MAKING_OPTIONS: SelectOption[] = [
  { value: 'dependent', label: 'Dependent' },
  { value: 'independet', label: 'Independent' },
  { value: 'counsole_with_parents', label: 'Counsel with Parents' },
  { value: 'counsole_with_bros_and_siss', label: 'Counsel with Siblings' },
  { value: 'counsole_with_childs', label: 'Counsel with Children' },
  { value: 'counsole_with_professional', label: 'Counsel with Professionals' },
];

/* ─── FinancialInformationSection ─────────────────────────────────────── */

function defaultFinancialForm(data: FinancialInformation | null) {
  return {
    job: data?.job ?? '',
    current_residence_status: data?.current_residence_status ?? ('' as CurrentResidenceStatusEnum),
    ownership_status: data?.ownership_status ?? ('' as OwnershipStatusEnum),
    rent_amount: data?.rent_amount ?? '',
    mortgage_amount: data?.mortgage_amount ?? '',
    capital: toArray(data?.capital) as AssetsEnum[],
    other_capital: data?.other_capital ?? '',
    after_marriage_residence_status: data?.after_marriage_residence_status ?? ('' as AfterMarriageResidenceStatusEnum),
    ex_spouse_financial_status: data?.ex_spouse_financial_status ?? ('' as ExSpouseFinancialStatusEnum),
    ex_spouse_financial_pay_status: data?.ex_spouse_financial_pay_status ?? ('' as ExSpouseFinancialPayStatusEnum),
    ex_spouse_financial_amount: data?.ex_spouse_financial_amount ?? '',
    future_spouse_dowry_type: toArray(data?.future_spouse_dowry_type) as DowryTypeEnum[],
    future_spose_dowry_amount: data?.future_spose_dowry_amount ?? '',
    future_spose_jahiziyeh: data?.future_spose_jahiziyeh ?? ('' as JahiziyehEnum),
    future_spose_jahiziyeh_explanation: data?.future_spose_jahiziyeh_explanation ?? '',
  };
}

export function FinancialInformationSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: FinancialInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultFinancialForm(data));

  const openModal = () => {
    reset(defaultFinancialForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        current_residence_status: state.current_residence_status || null,
        ownership_status: state.ownership_status || null,
        after_marriage_residence_status: state.after_marriage_residence_status || null,
        ex_spouse_financial_status: state.ex_spouse_financial_status || null,
        ex_spouse_financial_pay_status: state.ex_spouse_financial_pay_status || null,
        future_spose_jahiziyeh: state.future_spose_jahiziyeh || null,
      };
      if (data?.id) {
        await updateFinancialInformation(data.id, payload as any);
      } else {
        await createFinancialInformation(payload as any);
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
      <ProfileSection title="Financial Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Job" value={data?.job} />
        <DisplayRow label="Current Residence" value={data?.current_residence_status} />
        <DisplayRow label="Ownership Status" value={data?.ownership_status} />
        <DisplayRow label="Rent Amount" value={data?.rent_amount} />
        <DisplayRow label="Mortgage Amount" value={data?.mortgage_amount} />
        <DisplayRow label="Capital Assets" value={formatMultiValue(data?.capital, ASSETS_OPTIONS)} />
        <DisplayRow label="Other Capital" value={data?.other_capital} />
        <DisplayRow label="After Marriage Residence" value={data?.after_marriage_residence_status} />
        <DisplayRow label="Ex-Spouse Financial Status" value={data?.ex_spouse_financial_status} />
        <DisplayRow label="Ex-Spouse Financial Pay Status" value={data?.ex_spouse_financial_pay_status} />
        <DisplayRow label="Ex-Spouse Financial Amount" value={data?.ex_spouse_financial_amount} />
        <DisplayRow label="Future Spouse Dowry Type" value={formatMultiValue(data?.future_spouse_dowry_type, DOWRY_TYPE_OPTIONS)} />
        <DisplayRow label="Future Spouse Dowry Amount" value={data?.future_spose_dowry_amount} />
        <DisplayRow label="Future Spouse Jahiziyeh" value={data?.future_spose_jahiziyeh} />
        <DisplayRow label="Jahiziyeh Explanation" value={data?.future_spose_jahiziyeh_explanation} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-2xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Financial Information
          </h2>
          <div className="space-y-4">
            <FormField label="Job" name="job" type="text" value={state.job} onChange={handleChange} />
            <FormField label="Current Residence Status" name="current_residence_status" type="select" value={state.current_residence_status} onChange={handleChange} options={RESIDENCE_OPTIONS} />
            <FormField label="Ownership Status" name="ownership_status" type="select" value={state.ownership_status} onChange={handleChange} options={OWNERSHIP_OPTIONS} />
            {state.ownership_status === 'rent' && (
              <FormField label="Rent Amount" name="rent_amount" type="number" value={state.rent_amount} onChange={handleChange} />
            )}
            <FormField label="Mortgage Amount" name="mortgage_amount" type="number" value={state.mortgage_amount} onChange={handleChange} />
            <FormField label="Capital Assets" name="capital" type="multiselect" value={state.capital} onChange={handleChange} options={ASSETS_OPTIONS} />
            <FormField label="Other Capital" name="other_capital" type="text" value={state.other_capital} onChange={handleChange} />
            <FormField label="After Marriage Residence Status" name="after_marriage_residence_status" type="select" value={state.after_marriage_residence_status} onChange={handleChange} options={AFTER_MARRIAGE_RESIDENCE_OPTIONS} />
            <FormField label="Ex-Spouse Financial Status" name="ex_spouse_financial_status" type="select" value={state.ex_spouse_financial_status} onChange={handleChange} options={EX_SPOUSE_FIN_OPTIONS} />
            <FormField label="Ex-Spouse Financial Pay Status" name="ex_spouse_financial_pay_status" type="select" value={state.ex_spouse_financial_pay_status} onChange={handleChange} options={EX_SPOUSE_PAY_OPTIONS} />
            <FormField label="Ex-Spouse Financial Amount" name="ex_spouse_financial_amount" type="number" value={state.ex_spouse_financial_amount} onChange={handleChange} />
            <FormField label="Future Spouse Dowry Type" name="future_spouse_dowry_type" type="multiselect" value={state.future_spouse_dowry_type} onChange={handleChange} options={DOWRY_TYPE_OPTIONS} />
            <FormField label="Future Spouse Dowry Amount" name="future_spose_dowry_amount" type="number" value={state.future_spose_dowry_amount} onChange={handleChange} />
            <FormField label="Future Spouse Jahiziyeh" name="future_spose_jahiziyeh" type="select" value={state.future_spose_jahiziyeh} onChange={handleChange} options={JAHIZIYEH_OPTIONS} />
            <FormField label="Future Spouse Jahiziyeh Explanation" name="future_spose_jahiziyeh_explanation" type="textarea" value={state.future_spose_jahiziyeh_explanation} onChange={handleChange} />
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/* ─── IntellectualInformationSection ───────────────────────────────────── */

function defaultIntellectualForm(data: IntellectualInformation | null) {
  return {
    marriage_goals_purposes: data?.marriage_goals_purposes ?? '',
    opinion_about_womans_job: toArray(data?.opinion_about_womans_job) as WomanJobOpinionEnum[],
    opinion_about_womans_education: toArray(data?.opinion_about_womans_education) as WomanEducationOpinionEnum[],
    pros_of_yourself: data?.pros_of_yourself ?? '',
    cons_of_yourself: data?.cons_of_yourself ?? '',
    type_of_connection_with_friends: data?.type_of_connection_with_friends ?? ('' as FriendConnectionEnum),
    friends_connection_reason: data?.friends_connection_reason ?? '',
    political_orientation: data?.political_orientation ?? false,
    opinion_about_velayat_faqih: data?.opinion_about_velayat_faqih ?? ('' as VelayatFaqihEnum),
    opinion_about_child_quantity: data?.opinion_about_child_quantity ?? ('' as ChildQuantityEnum),
    contract_how: data?.contract_how ?? ('' as ContractHowEnum),
    wedding_how: data?.wedding_how ?? ('' as WeddingHowEnum),
    worship_and_prayer: data?.worship_and_prayer ?? ('' as WorshipAndPrayerEnum),
    fasting: data?.fasting ?? ('' as FastingEnum),
    fasting_explanation: data?.fasting_explanation ?? '',
    cover_type_house: data?.cover_type_house ?? ('' as CoverTypeHouseEnum),
    cover_type_society: data?.cover_type_society ?? ('' as CoverTypeSocietyEnum),
    participating_in_religious_meetings: data?.participating_in_religious_meetings ?? ('' as ParticipationEnum),
    music: data?.music ?? ('' as MusicEnum),
    dance_singing_assemblies: data?.dance_singing_assemblies ?? ('' as DanceSingingEnum),
    opinion_about_innocent_contact: data?.opinion_about_innocent_contact ?? ('' as InnocentContactEnum),
    cover_type_innocent_contact: data?.cover_type_innocent_contact ?? ('' as CoverTypeInnocentContactEnum),
    decision_making_choosing_spouse: data?.decision_making_choosing_spouse ?? ('' as DecisionMakingEnum),
  };
}

export function IntellectualInformationSection({
  data,
  onReload,
  isCollapsed,
  onToggleCollapse,
}: {
  data: IntellectualInformation | null;
  onReload: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { state, handleChange, reset } = useFormState(defaultIntellectualForm(data));

  const openModal = () => {
    reset(defaultIntellectualForm(data));
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...state,
        type_of_connection_with_friends: state.type_of_connection_with_friends || null,
        opinion_about_velayat_faqih: state.opinion_about_velayat_faqih || null,
        opinion_about_child_quantity: state.opinion_about_child_quantity || null,
        contract_how: state.contract_how || null,
        wedding_how: state.wedding_how || null,
        worship_and_prayer: state.worship_and_prayer || null,
        fasting: state.fasting || null,
        cover_type_house: state.cover_type_house || null,
        cover_type_society: state.cover_type_society || null,
        participating_in_religious_meetings: state.participating_in_religious_meetings || null,
        music: state.music || null,
        dance_singing_assemblies: state.dance_singing_assemblies || null,
        opinion_about_innocent_contact: state.opinion_about_innocent_contact || null,
        cover_type_innocent_contact: state.cover_type_innocent_contact || null,
        decision_making_choosing_spouse: state.decision_making_choosing_spouse || null,
      };
      if (data?.id) {
        await updateIntellectualInformation(data.id, payload as any);
      } else {
        await createIntellectualInformation(payload as any);
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
      <ProfileSection title="Intellectual Information" onEdit={openModal} isEmpty={!data} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse}>
        <DisplayRow label="Marriage Goals & Purposes" value={data?.marriage_goals_purposes} />
        <DisplayRow label="Opinion About Woman's Job" value={formatMultiValue(data?.opinion_about_womans_job, WOMAN_JOB_OPTIONS)} />
        <DisplayRow label="Opinion About Woman's Education" value={formatMultiValue(data?.opinion_about_womans_education, WOMAN_EDU_OPTIONS)} />
        <DisplayRow label="Pros of Yourself" value={data?.pros_of_yourself} />
        <DisplayRow label="Cons of Yourself" value={data?.cons_of_yourself} />
        <DisplayRow label="Friend Connection" value={data?.type_of_connection_with_friends} />
        <DisplayRow label="Friends Connection Reason" value={data?.friends_connection_reason} />
        <DisplayRow label="Political Orientation" value={data?.political_orientation ? 'Yes' : 'No'} />
        <DisplayRow label="Opinion About Velayat Faqih" value={data?.opinion_about_velayat_faqih} />
        <DisplayRow label="Child Quantity Preference" value={data?.opinion_about_child_quantity} />
        <DisplayRow label="Contract Ceremony" value={data?.contract_how} />
        <DisplayRow label="Wedding Ceremony" value={data?.wedding_how} />
        <DisplayRow label="Worship & Prayer" value={data?.worship_and_prayer} />
        <DisplayRow label="Fasting" value={data?.fasting} />
        <DisplayRow label="Fasting Explanation" value={data?.fasting_explanation} />
        <DisplayRow label="Cover Type (House)" value={data?.cover_type_house} />
        <DisplayRow label="Cover Type (Society)" value={data?.cover_type_society} />
        <DisplayRow label="Religious Meetings" value={data?.participating_in_religious_meetings} />
        <DisplayRow label="Music" value={data?.music} />
        <DisplayRow label="Dance / Singing Assemblies" value={data?.dance_singing_assemblies} />
        <DisplayRow label="Opinion on Innocent Contact (Non-Mahram)" value={data?.opinion_about_innocent_contact} />
        <DisplayRow label="Cover for Innocent Contact" value={data?.cover_type_innocent_contact} />
        <DisplayRow label="Decision Making in Choosing Spouse" value={data?.decision_making_choosing_spouse} />
      </ProfileSection>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-3xl w-full">
        <div className="p-6 max-h-[80vh] overflow-y-auto w-full">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            {data ? 'Edit' : 'Add'} Intellectual Information
          </h2>
          <div className="space-y-4">
            <FormField label="Marriage Goals & Purposes" name="marriage_goals_purposes" type="textarea" value={state.marriage_goals_purposes} onChange={handleChange} />
            <FormField label="Opinion About Woman's Job" name="opinion_about_womans_job" type="multiselect" value={state.opinion_about_womans_job} onChange={handleChange} options={WOMAN_JOB_OPTIONS} />
            <FormField label="Opinion About Woman's Education" name="opinion_about_womans_education" type="multiselect" value={state.opinion_about_womans_education} onChange={handleChange} options={WOMAN_EDU_OPTIONS} />
            <FormField label="Pros of Yourself" name="pros_of_yourself" type="textarea" value={state.pros_of_yourself} onChange={handleChange} />
            <FormField label="Cons of Yourself" name="cons_of_yourself" type="textarea" value={state.cons_of_yourself} onChange={handleChange} />
            <FormField label="Type of Connection with Friends" name="type_of_connection_with_friends" type="select" value={state.type_of_connection_with_friends} onChange={handleChange} options={FRIEND_CONN_OPTIONS} />
            <FormField label="Friends Connection Reason" name="friends_connection_reason" type="textarea" value={state.friends_connection_reason} onChange={handleChange} />
            <FormField label="Political Orientation" name="political_orientation" type="boolean" value={state.political_orientation} onChange={handleChange} />
            <FormField label="Opinion About Velayat Faqih" name="opinion_about_velayat_faqih" type="select" value={state.opinion_about_velayat_faqih} onChange={handleChange} options={VELAYAT_FAQIH_OPTIONS} />
            <FormField label="Child Quantity Preference" name="opinion_about_child_quantity" type="select" value={state.opinion_about_child_quantity} onChange={handleChange} options={CHILD_QTY_OPTIONS} />
            <FormField label="Contract Ceremony How" name="contract_how" type="select" value={state.contract_how} onChange={handleChange} options={CONTRACT_HOW_OPTIONS} />
            <FormField label="Wedding Ceremony How" name="wedding_how" type="select" value={state.wedding_how} onChange={handleChange} options={WEDDING_HOW_OPTIONS} />
            <FormField label="Worship and Prayer" name="worship_and_prayer" type="select" value={state.worship_and_prayer} onChange={handleChange} options={WORSHIP_OPTIONS} />
            <FormField label="Fasting" name="fasting" type="select" value={state.fasting} onChange={handleChange} options={FASTING_OPTIONS} />
            <FormField label="Fasting Explanation" name="fasting_explanation" type="textarea" value={state.fasting_explanation} onChange={handleChange} />
            <FormField label="Cover Type in House" name="cover_type_house" type="select" value={state.cover_type_house} onChange={handleChange} options={COVER_HOUSE_OPTIONS} />
            <FormField label="Cover Type in Society" name="cover_type_society" type="select" value={state.cover_type_society} onChange={handleChange} options={COVER_SOCIETY_OPTIONS} />
            <FormField label="Religious Meetings Participation" name="participating_in_religious_meetings" type="select" value={state.participating_in_religious_meetings} onChange={handleChange} options={PARTICIPATION_OPTIONS} />
            <FormField label="Music" name="music" type="select" value={state.music} onChange={handleChange} options={MUSIC_OPTIONS} />
            <FormField label="Dance / Singing Assemblies" name="dance_singing_assemblies" type="select" value={state.dance_singing_assemblies} onChange={handleChange} options={MUSIC_OPTIONS} />
            <FormField label="Innocent Contact with Non-Mahram" name="opinion_about_innocent_contact" type="select" value={state.opinion_about_innocent_contact} onChange={handleChange} options={INNOCENT_CONTACT_OPTIONS} />
            <FormField label="Cover for Innocent Contact" name="cover_type_innocent_contact" type="select" value={state.cover_type_innocent_contact} onChange={handleChange} options={COVER_INNOCENT_OPTIONS} />
            <FormField label="Decision Making for Choosing Spouse" name="decision_making_choosing_spouse" type="select" value={state.decision_making_choosing_spouse} onChange={handleChange} options={DECISION_MAKING_OPTIONS} />
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