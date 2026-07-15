export interface PCQueueCase {
  id: string;
  createdInConnect: string;
  createdTime: string;
  account: string;
  mrn: string;
  dos: string;
  patientName: string;
  provider: string;
  providerEmail?: string;
  scribe: string;
  reason: string;
  lastComment: string;
  submittedBy: string;
  submittedTime?: string;
  hasCommentIcon?: boolean;
}

export interface WaitingReviewCase {
  id: string;
  account: string;
  mrn: string;
  dos: string;
  patientName: string;
  provider: string;
  providerEmail?: string;
  scribe: string;
  reason: string;
  lastComment: string;
  submittedBy: string;
  submittedTime?: string;
}

export const MOCK_PC_QUEUE: PCQueueCase[] = [
  {
    id: '1',
    createdInConnect: '03/08/2026',
    createdTime: '1:15 pm',
    account: '981904',
    mrn: 'M000316483',
    dos: '03/02/2026',
    patientName: 'BE**, C*',
    provider: 'SHEALY, JENNIFER',
    providerEmail: 'jennifer.shealy.pa@gmail.com',
    scribe: '',
    reason: '500 Missing PE',
    lastComment: 'Changes made to Chart',
    submittedBy: 'Benoit',
    submittedTime: '04/27/2026 5:04 am',
    hasCommentIcon: true
  },
  {
    id: '2',
    createdInConnect: '03/30/2026',
    createdTime: '10:35 am',
    account: '985669',
    mrn: 'M000260734',
    dos: '01/25/2026',
    patientName: 'WO**, D*',
    provider: '',
    scribe: '',
    reason: '956 Wrong chart scanned in LF. Scan correct chart.',
    lastComment: 'Correct chart has been downloaded. Nothing needed at this time, thank you.',
    submittedBy: 'Franklyn',
    submittedTime: '04/15/2026 2:19 pm',
    hasCommentIcon: true
  },
  {
    id: '3',
    createdInConnect: '06/05/2026',
    createdTime: '12:35 pm',
    account: '994824',
    mrn: 'M000153405',
    dos: '03/22/2026',
    patientName: 'HO**, C*',
    provider: 'LEON-ALBARRAN, MIGUEL',
    providerEmail: 'miguel.leonmeds@gmail.com',
    scribe: '',
    reason: '921 Provider\'s signature is missing',
    lastComment: '',
    submittedBy: '',
    hasCommentIcon: true
  },
  {
    id: '4',
    createdInConnect: '06/05/2026',
    createdTime: '4:47 pm',
    account: '1002998',
    mrn: 'M000453302',
    dos: '05/18/2026',
    patientName: 'PI**, M*',
    provider: 'ALVAREZ, MARTA',
    providerEmail: 'MART463MD@CHARTER.NET',
    scribe: '',
    reason: '953 Missing ED Note-Physician',
    lastComment: '',
    submittedBy: '',
    hasCommentIcon: true
  },
  {
    id: '5',
    createdInConnect: '06/05/2026',
    createdTime: '5:47 pm',
    account: '1003903',
    mrn: 'M000628321',
    dos: '05/23/2026',
    patientName: 'RO**, K*',
    provider: 'AMR, OMAR',
    providerEmail: 'omaramrmd@gmail.com',
    scribe: '',
    reason: '953 Missing ED Note-Physician',
    lastComment: '',
    submittedBy: '',
    hasCommentIcon: true
  },
  {
    id: '6',
    createdInConnect: '06/06/2026',
    createdTime: '9:15 am',
    account: '1004123',
    mrn: 'M000654321',
    dos: '05/25/2026',
    patientName: 'SM**, J*',
    provider: 'DOE, JOHN',
    providerEmail: 'jdoe@gmail.com',
    scribe: '',
    reason: '921 Provider\'s signature is missing',
    lastComment: 'Waiting for signature',
    submittedBy: 'Franklyn',
    submittedTime: '06/08/2026 10:00 am',
    hasCommentIcon: true
  }
];

export const MOCK_WAITING_REVIEW: WaitingReviewCase[] = [
  { id: '1', account: '1000002', mrn: 'MC00576231', dos: '04/27/2026', patientName: 'JO**, D*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 3:12 pm' },
  { id: '2', account: '999155', mrn: 'MC00553072', dos: '04/22/2026', patientName: 'SA**, A*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 3:04 pm' },
  { id: '3', account: '998824', mrn: 'MC00570379', dos: '04/20/2026', patientName: 'RI**, S*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:38 pm' },
  { id: '4', account: '998948', mrn: 'MC00597266', dos: '04/20/2026', patientName: 'JO**, L*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:38 pm' },
  { id: '5', account: '998898', mrn: 'MC00701158', dos: '04/20/2026', patientName: 'BE**, C*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:38 pm' },
  { id: '6', account: '998413', mrn: 'MC00623727', dos: '04/16/2026', patientName: 'RO**, N*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:41 pm' },
  { id: '7', account: '997828', mrn: 'MC00340277', dos: '04/12/2026', patientName: 'SI**, R*', provider: 'KEMEN, CHRIS', providerEmail: 'ckemen530@gmail.com', scribe: '', reason: '987 Correct information discrepancy documented in', lastComment: 'Please confirm electrocardioversion was performed on this patient and if so provide supporting diagnosis.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:38 pm' },
  { id: '8', account: '997737', mrn: 'MC00592541', dos: '04/11/2026', patientName: 'RA**, S*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:33 pm' },
  { id: '9', account: '997695', mrn: 'MC00700758', dos: '04/11/2026', patientName: 'DE**, B*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 2:32 pm' },
  { id: '10', account: '997574', mrn: 'MC00682587', dos: '04/10/2026', patientName: 'AG**, G*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:59 pm' },
  { id: '11', account: '997432', mrn: 'MC00379187', dos: '04/09/2026', patientName: 'WR**, C*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:56 pm' },
  { id: '12', account: '997514', mrn: 'MC00308796', dos: '04/09/2026', patientName: 'WI**, F*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:56 pm' },
  { id: '13', account: '997489', mrn: 'MC00358595', dos: '04/09/2026', patientName: 'MA**, R*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:55 pm' },
  { id: '14', account: '997237', mrn: 'MC00695439', dos: '04/08/2026', patientName: 'PA**, S*', provider: 'KING, JUSTIN', providerEmail: 'king55607@gmail.com', scribe: '', reason: '909 Missing Procedure', lastComment: 'Need details of blister drainage', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:51 pm' },
  { id: '15', account: '997325', mrn: 'MC00272809', dos: '04/08/2026', patientName: 'FE**, T*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:48 pm' },
  { id: '16', account: '997335', mrn: 'MC00683062', dos: '04/08/2026', patientName: 'AD**, K*', provider: '', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Patient signed out to unknown oncoming provider.', submittedBy: 'Franklyn', submittedTime: '05/07/2026 1:45 pm' },
  { id: '17', account: '982890', mrn: 'MC00455920', dos: '12/29/2025', patientName: 'AL**, G*', provider: 'MITCHELL, THOMAS', providerEmail: 'tmitchell1@aol.com', scribe: '', reason: '500 Missing PE', lastComment: 'Exam shows only the patients vitals.', submittedBy: 'Franklyn', submittedTime: '04/22/2026 2:46 pm' },
  { id: '18', account: '982893', mrn: 'MC00393021', dos: '12/29/2025', patientName: 'BR**, J*', provider: 'MITCHELL, THOMAS', providerEmail: 'tmitchell1@aol.com', scribe: '', reason: '967 Disposition is not documented', lastComment: 'Did you sign the patient out to another provider?', submittedBy: 'Franklyn', submittedTime: '04/22/2026 2:44 pm' }
];
