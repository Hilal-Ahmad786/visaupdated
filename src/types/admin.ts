/**
 * Admin domain model (Part 2). These types describe the CMS/operations layer.
 * They are satisfied today by the typed mock-data layer (`src/lib/data/*`) and
 * are shaped like real API boundaries so a backend can replace the mocks later.
 */

// ---------- Permissions & roles ----------

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'review'
  | 'approve'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'delete'
  | 'export'
  | 'manage_settings'
  | 'view_sensitive'
  | 'assign';

export type AdminModule =
  | 'dashboard'
  | 'leads'
  | 'pipeline'
  | 'countries'
  | 'country_pages'
  | 'services'
  | 'blog'
  | 'faq'
  | 'forms'
  | 'homepage'
  | 'navigation'
  | 'tracking'
  | 'settings'
  | 'users'
  | 'audit';

/** A permission string is `module:action`, e.g. "leads:export". */
export type Permission = `${AdminModule}:${PermissionAction}`;

export type ScopeKind =
  | 'own'
  | 'team'
  | 'all'
  | 'countries'
  | 'services'
  | 'pipelines'
  | 'modules';

export interface AccessScope {
  kind: ScopeKind;
  values?: string[];
}

export type RoleRisk = 'low' | 'medium' | 'high' | 'critical';

export interface Role {
  id: string;
  name: string;
  description: string;
  /** '*' grants all permissions (super admin). */
  permissions: Permission[] | ['*'];
  inheritsRoleIds?: string[];
  scope: AccessScope;
  risk: RoleRisk;
  system: boolean; // system roles cannot be deleted
  userCount: number;
}

export type UserStatus = 'active' | 'invited' | 'suspended' | 'deactivated';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  roleIds: string[];
  teamId?: string;
  status: UserStatus;
  mfaEnabled: boolean;
  lastActiveAt?: string;
  createdAt: string;
  /** Direct grants/denies layered on top of role permissions. */
  directGrants?: Permission[];
  directDenies?: Permission[];
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export interface Session {
  id: string;
  userId: string;
  device: string;
  ip: string; // masked for display
  current: boolean;
  startedAt: string;
  lastSeenAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  roleIds: string[];
  invitedBy: string;
  status: 'pending' | 'expired' | 'accepted';
  expiresAt: string;
}

// ---------- Leads operations (extends the public Lead) ----------

export type LeadPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  /** Allowed next stages — transitions outside this set are invalid. */
  allowedNext: string[];
  warnAfterDays?: number;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface FollowUp {
  id: string;
  dueAt: string;
  note: string;
  done: boolean;
  assigneeId?: string;
}

export interface LeadNote {
  id: string;
  authorId: string;
  createdAt: string;
  body: string;
  internal: boolean;
}

export interface LeadFile {
  id: string;
  name: string;
  kind: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface CommunicationEntry {
  id: string;
  channel: 'phone' | 'whatsapp' | 'email' | 'note';
  direction: 'in' | 'out';
  at: string;
  summary: string;
}

export interface TimelineEntry {
  id: string;
  at: string;
  actor: string;
  text: string;
}

/** Operational lead record used across admin screens. */
export interface AdminLead {
  id: string;
  reference: string;
  name: string;
  /** Stored full but masked at display time unless reveal is permitted. */
  phone: string;
  email: string;
  city?: string;
  country: string;
  service?: string;
  visaType?: string;
  status: string; // workflow status label key
  stageId: string;
  pipelineId: string;
  priority: LeadPriority;
  assigneeId?: string;
  teamId?: string;
  source: string;
  campaign?: { utm_source?: string; utm_medium?: string; utm_campaign?: string };
  followUpAt?: string;
  lastActivityAt: string;
  createdAt: string;
  ageInStageDays: number;
  consent: { kvkk: boolean; marketing: boolean; consentedAt: string };
  duplicateOf?: string;
  notes: LeadNote[];
  files: LeadFile[];
  followUps: FollowUp[];
  communications: CommunicationEntry[];
  timeline: TimelineEntry[];
}

// ---------- Content workflow ----------

export type WorkflowState = 'draft' | 'in_review' | 'changes_requested' | 'approved' | 'scheduled' | 'published' | 'archived';

export interface ContentHealth {
  score: number; // 0-100
  issues: string[];
  lastVerifiedAt?: string;
}

export interface VersionRecord {
  id: string;
  label: string;
  authorId: string;
  createdAt: string;
  state: WorkflowState;
  note?: string;
}

// ---------- Forms (Form Builder) ----------

export type FieldType =
  | 'text'
  | 'email'
  | 'phone'
  | 'select'
  | 'country'
  | 'visa_type'
  | 'applicant_status'
  | 'date'
  | 'number'
  | 'textarea'
  | 'file'
  | 'consent'
  | 'hidden';

export type PrivacyClass = 'public' | 'personal' | 'sensitive';

export interface FormField {
  id: string;
  key: string; // stable internal key
  type: FieldType;
  label: string;
  required: boolean;
  privacy: PrivacyClass;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface FormStep {
  id: string;
  title: string;
  fieldIds: string[];
}

export interface FormLogicRule {
  id: string;
  whenFieldKey: string;
  equals: string;
  action: 'show' | 'hide' | 'require';
  targetFieldKey: string;
}

export interface FormDefinition {
  id: string;
  name: string;
  state: WorkflowState;
  steps: FormStep[];
  fields: FormField[];
  logic: FormLogicRule[];
  routing: { team?: string; assignee?: string; byCountry?: boolean };
  notifications: { adminEmail: boolean; visitorEmail: boolean };
  successBehavior: 'thank_you' | 'message';
  testMode: boolean;
  version: number;
  submissions: number;
  updatedAt: string;
}

// ---------- Settings ----------

export interface TrackingProvider {
  id: 'gtm' | 'ga4' | 'google_ads' | 'meta_pixel';
  name: string;
  enabled: boolean;
  measurementId: string;
  status: 'connected' | 'paused' | 'not_configured';
}

export interface TrackingEventMap {
  event: string;
  conversion: boolean;
  /** Only stable, privacy-safe params allowed. */
  params: string[];
}

export interface GeneralSettings {
  brandShort: string;
  brandFull: string;
  phoneDisplay: string;
  phoneE164: string;
  whatsapp: string;
  email: string;
  address: string;
  workingHours: { label: string; value: string }[];
  defaultFormId: string;
  seoTitleTemplate: string;
  legalDisclaimer: string;
  social: { label: string; url: string }[];
}

// ---------- Audit ----------

export type AuditSeverity = 'info' | 'notice' | 'warning' | 'critical';
export type AuditResult = 'success' | 'failure' | 'denied';

export interface AuditEvent {
  id: string;
  correlationId: string;
  at: string;
  severity: AuditSeverity;
  event: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  target: string;
  module: AdminModule;
  result: AuditResult;
  source: string; // ip masked
  reviewStatus: 'none' | 'reviewed' | 'investigating' | 'legal_hold';
  sensitive: boolean;
  previousValue?: string;
  newValue?: string;
}
