import { useState } from 'react';
import { GREY } from '../../../theme/palette.ts';
import { 
  Box, 
  Card, 
  Typography, 
  IconButton, 
  useTheme, 
  alpha,
  Divider,
  List,
  ListItemButton,
  ListItemIcon
} from '@mui/material';
import { 
  Printer, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  FileText,
  Bookmark,
  CheckCircle
} from 'lucide-react';

// ----------------------------------------------------------------------

interface DocumentPage {
  pageNumber: number;
  title: string;
  sections: {
    heading: string;
    paragraphs: string[];
    listItems?: string[];
  }[];
}

interface DocumentItem {
  id: string;
  title: string;
  pages: DocumentPage[];
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: '1',
    title: '2023 Observation Services Documentation',
    pages: [
      {
        pageNumber: 1,
        title: '2023 Observation Services Guide',
        sections: [
          {
            heading: '1. Introduction to Observation Services',
            paragraphs: [
              'Observation services are a well-defined set of clinically appropriate services, which include ongoing short term treatment, assessment, and reassessment. They are provided before a decision can be made regarding whether a patient requires inpatient hospital admission or can be safely discharged.',
              'This document outlines the clinical protocols, billing regulations, and documentation standards for observation stays at PC Connect facilities.'
            ]
          },
          {
            heading: '2. Clinical Justification & Admission Criteria',
            paragraphs: [
              'Observation status is appropriate for patients who present with conditions that are expected to resolve within 24 to 48 hours, or where the diagnosis remains unclear but the clinical condition requires active monitoring.',
              'Common clinical presentations qualifying for observation status include: acute chest pain rule-out, mild-to-moderate asthma exacerbations, dehydration requiring intravenous fluids, and post-procedural recovery.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Billing and Compliance Framework',
        sections: [
          {
            heading: '3. Coding and Medical Necessity',
            paragraphs: [
              'To meet Medicare and private payor guidelines, observation services must be ordered by a physician or other authorized practitioner. The order must state "Place in Observation" and include a clear clinical rationale.',
              'Billing codes (CPT 99217-99220 and 99224-99226) require detailed reporting of the exact start and stop times. Face-to-face evaluation by the billing provider must be documented daily.'
            ]
          },
          {
            heading: '4. Documentation Audit Checklist',
            paragraphs: [
              'Ensure all observation charts contain the following critical elements prior to coding review:'
            ],
            listItems: [
              'Written provider order specifying "Observation Status" and rationale.',
              'Hourly nursing flow sheets indicating active treatments and frequent monitoring.',
              'A minimum of two physician progress notes indicating reassessment within a 24-hour cycle.',
              'Discharge summary describing patient outcome and detailed follow-up appointments.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Critical care',
    pages: [
      {
        pageNumber: 1,
        title: 'Critical Care Medicine Protocols',
        sections: [
          {
            heading: '1. General Admission Criteria',
            paragraphs: [
              'Critical care services are indicated for patients with acute, life-threatening organ dysfunction or failure. Admission decisions are based on physiologic instability, monitoring needs, and therapeutic interventions requiring intensive nursing care.',
              'Frequent assessment of the Glasgow Coma Scale (GCS), hemodynamics, and oxygenation status is mandatory during the initial 4-hour window.'
            ]
          },
          {
            heading: '2. Vasoactive Medication Protocols',
            paragraphs: [
              'Norepinephrine is the first-line vasopressor for septic shock. Titration must be based on Mean Arterial Pressure (MAP) goals (typically > 65 mmHg) and documented every 15 minutes during the initiation phase.',
              'Inotropic support with Dobutamine may be considered in cardiogenic shock with adequate perfusion pressures.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Mechanical Ventilation Standards',
        sections: [
          {
            heading: '3. Lung-Protective Ventilation Strategy',
            paragraphs: [
              'To minimize ventilator-induced lung injury (VILI), patients with Acute Respiratory Distress Syndrome (ARDS) should be managed with low tidal volumes (6 mL/kg predicted body weight).',
              'Keep plateau pressure under 30 cm H2O and optimize positive end-expiratory pressure (PEEP) to maximize alveolar recruitment.'
            ],
            listItems: [
              'Target Tidal Volume: 6 mL/kg PBW',
              'Plateau Pressure Goal: < 30 cm H2O',
              'PEEP Titration: According to the FiO2/PEEP table to maintain SpO2 88-95%',
              'Daily Spontaneous Breathing Trials (SBT) for weaning assessment'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'EKG Documentation',
    pages: [
      {
        pageNumber: 1,
        title: '12-Lead EKG Placement and Reporting',
        sections: [
          {
            heading: '1. Anatomical Electrode Placement',
            paragraphs: [
              'Accurate electrode placement is critical to prevent diagnostic errors and artifacts. The standard 12-lead EKG requires 10 physical electrode placements:',
              'Precordial leads V1 through V6 must be placed precisely according to intercostal markings, not by visual estimation.'
            ],
            listItems: [
              'V1: 4th intercostal space, right sternal border.',
              'V2: 4th intercostal space, left sternal border.',
              'V3: Midway between V2 and V4.',
              'V4: 5th intercostal space, mid-clavicular line.',
              'V5: Anterior axillary line, same horizontal level as V4.',
              'V6: Mid-axillary line, same horizontal level as V4.'
            ]
          },
          {
            heading: '2. Interpretive Interval Metrics',
            paragraphs: [
              'Every clinical EKG note must document standard interval measurements including: PR Interval (normal 120-200 ms), QRS Duration (normal < 120 ms), and QTc Interval (normal < 450 ms for males, < 460 ms for females).',
              'QTc prolongation (> 500 ms) poses a high risk of Torsades de Pointes and requires immediate provider notification and review of active medications.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '4',
    title: 'MAT ED Documentation',
    pages: [
      {
        pageNumber: 1,
        title: 'Medication Assisted Treatment in the ED',
        sections: [
          {
            heading: '1. Program Overview and Goals',
            paragraphs: [
              'PC Connect’s Medication Assisted Treatment (MAT) in the Emergency Department focuses on the immediate stabilization of patients experiencing opioid use disorder (OUD). This initiative aims to reduce mortality, decrease withdrawal distress, and bridge patients into long-term outpatient recovery.',
              'The protocol includes screening, medical assessment, sublingual buprenorphine induction, and direct scheduling with a clinic partner.'
            ]
          },
          {
            heading: '2. Clinical Opiate Withdrawal Scale (COWS)',
            paragraphs: [
              'Prior to administering the first dose of buprenorphine, the clinical team must calculate and record a COWS score. Initiating induction prematurely can cause severe precipitated withdrawal.',
              'Induction is indicated only when the patient shows objective signs of moderate-to-severe withdrawal, corresponding to a COWS score of 8 or higher.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Buprenorphine Induction & Discharge',
        sections: [
          {
            heading: '3. Induction Dosing Guidelines',
            paragraphs: [
              'The standard first-day induction protocol is structured as follows:'
            ],
            listItems: [
              'Initial Dose: 4 mg - 8 mg Buprenorphine sublingually.',
              'Observation Period: Monitor the patient in the ED for 45 to 60 minutes.',
              'Reassessment: Calculate a repeat COWS score.',
              'Supplemental Dose: If withdrawal symptoms persist, administer an additional 4 mg (maximum Day 1 total of 12-16 mg).'
            ]
          },
          {
            heading: '4. Safe Discharge and Warm Hand-off',
            paragraphs: [
              'Before discharging the patient, the care coordinator must secure a scheduled appointment at an outpatient addiction clinic within 72 hours. Provide the patient with a Narcan rescue kit and educational leaflets detailing the treatment path.',
              'The ED provider should document the name of the outpatient clinic, date/time of the follow-up appointment, and confirmation of Narcan education.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '5',
    title: 'Medical Student Documentation and Billing Guidelines',
    pages: [
      {
        pageNumber: 1,
        title: 'Medical Student Documentation Compliance',
        sections: [
          {
            heading: '1. CMS Guidelines for Teaching Settings',
            paragraphs: [
              'The Centers for Medicare & Medicaid Services (CMS) allow medical student documentation of Evaluation and Management (E/M) services to be used for billing purposes.',
              'This guideline outlines the billing rules, required student roles, and the precise documentation templates attending physicians must use to remain fully compliant.'
            ]
          },
          {
            heading: '2. Student Participation Limits',
            paragraphs: [
              'While students can document all sections of the history, physical exam, and clinical reasoning, they cannot act independently.',
              'The teaching physician must personally perform or re-perform the physical examination and the medical decision-making components of the service.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Attestation Templates',
        sections: [
          {
            heading: '3. Required Attesting Verbiage',
            paragraphs: [
              'To bill using medical student notes, the attending physician must append a signed attestation indicating personal involvement.',
              'Approved attestation text:'
            ],
            listItems: [
              '"I have personally evaluated this patient, performed the physical exam, and reviewed the medical student\'s notes. I agree with the findings and plan documented herein with the following modifications..."',
              'Macro short-codes (e.g. .STUDENTATT) should be configured in the EHR to guarantee consistent compliance across all departments.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '6',
    title: 'Moderate Sedation',
    pages: [
      {
        pageNumber: 1,
        title: 'Moderate Sedation Protocol & Standards',
        sections: [
          {
            heading: '1. Scope of Procedure',
            paragraphs: [
              'Moderate (conscious) sedation is a drug-induced depression of consciousness during which patients respond purposefully to verbal commands, either alone or accompanied by light tactile stimulation.',
              'This policy establishes the minimum requirements for pre-procedural assessment, active sedation monitoring, and discharge safety criteria.'
            ]
          },
          {
            heading: '2. Pre-Procedure Verification Checklist',
            paragraphs: [
              'The clinical team must perform the following tasks before administering any sedative medication:'
            ],
            listItems: [
              'Obtain and document formal informed consent for both the procedure and the sedation.',
              'Complete a comprehensive history and physical, with special attention to airway anatomy (Mallampati class, thyromental distance).',
              'Verify NPO status: 2 hours for clear liquids, 6 hours for light meals.',
              'Ensure emergency airway equipment, suction, and reversal agents (Naloxone, Flumazenil) are at the bedside.'
            ]
          }
        ]
      },
      {
        pageNumber: 2,
        title: 'Intra-Procedure & Recovery Monitoring',
        sections: [
          {
            heading: '3. Intra-Procedure Monitoring Requirements',
            paragraphs: [
              'A dedicated registered nurse, separate from the practitioner performing the procedure, must be present to monitor the patient’s vital signs and level of consciousness.',
              'Record heart rate, respiratory rate, blood pressure, oxygen saturation, and capnography values at a minimum of every 5 minutes during the active sedation phase.'
            ]
          },
          {
            heading: '4. Discharge Safety Criteria (Aldrete Score)',
            paragraphs: [
              'Patients may be discharged from the recovery area only after meeting the standard Aldrete Score (score >= 9).',
              'Discharge criteria include: returning to baseline mental status, stable vital signs for at least 30 minutes post-procedure, absence of nausea, ability to tolerate oral fluids, and the presence of a responsible adult escort.'
            ]
          }
        ]
      }
    ]
  },
  {
    id: '7',
    title: 'Updated Teaching Physician Doc Guide 2021',
    pages: [
      {
        pageNumber: 1,
        title: 'Teaching Physician Guidelines (2021 Update)',
        sections: [
          {
            heading: '1. Key Updates for E/M Documentation',
            paragraphs: [
              'Effective 2021, E/M services are coded based on either medical decision-making (MDM) or the total time spent by the billing provider on the date of the encounter. This change significantly simplifies the requirements for historical elements and physical exam counts.',
              'For teaching settings, the teaching physician can only count time that they personally spent evaluating the patient, counseling, or coordinating care. Time spent by the resident physician cannot be added to the teaching physician\'s time.'
            ]
          },
          {
            heading: '2. Supervision Levels and Documentation',
            paragraphs: [
              'The teaching physician must document their presence and participation in the service. The resident notes alone, even with an attending signature, do not satisfy billing requirements without a substantive attending entry.'
            ],
            listItems: [
              'Direct Supervision: Attending must be physically present in the room for key portions of the service.',
              'Primary Care Exception: In designated primary care clinics, the attending may supervise residents without personal face-to-face evaluation, provided they review the case immediately following the resident\'s assessment.'
            ]
          }
        ]
      }
    ]
  }
];

export default function EducationalResourcesView() {
  const theme = useTheme();
  
  // Navigation & selected document state
  const [selectedDocId, setSelectedDocId] = useState('4'); // Default to MAT ED Documentation as seen in screenshot
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [zoomScale, setZoomScale] = useState(100);

  // Active document helper
  const activeDoc = DOCUMENTS.find(doc => doc.id === selectedDocId) || DOCUMENTS[0];
  const maxPages = activeDoc.pages.length;
  
  // Guard page range when switching docs
  const handleSelectDoc = (id: string) => {
    setSelectedDocId(id);
    setCurrentPageNum(1);
  };

  const activePage = activeDoc.pages.find(p => p.pageNumber === currentPageNum) || activeDoc.pages[0];

  // Actions
  const handleZoomIn = () => {
    if (zoomScale < 150) setZoomScale(prev => prev + 10);
  };

  const handleZoomOut = () => {
    if (zoomScale > 70) setZoomScale(prev => prev - 10);
  };

  const handlePrevPage = () => {
    if (currentPageNum > 1) setCurrentPageNum(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPageNum < maxPages) setCurrentPageNum(prev => prev + 1);
  };

  const handleDownload = () => {
    alert(`Downloading "${activeDoc.title}.pdf"`);
  };

  const handlePrint = () => {
    alert(`Preparing print job for "${activeDoc.title}"`);
  };

  return (
    <Box sx={{ width: 1, pb: 5, mt: 0 }}>
      {/* Main 2-Column Layout */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '370px 1fr' }, 
          gap: 2.5, 
          alignItems: 'start' 
        }}
      >
        {/* Left Side: Document Navigation Sidebar */}
        <Card 
          sx={{ 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 'none',
            bgcolor: theme.palette.background.paper,
            minHeight: '83vh'
          }}
        >
          <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
            {DOCUMENTS.map((doc) => {
              const isSelected = doc.id === selectedDocId;
              
              return (
                <ListItemButton
                  key={doc.id}
                  onClick={() => handleSelectDoc(doc.id)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    width: '100%',
                    fontWeight: 600,
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                    color: isSelected ? theme.palette.primary.main : 'text.primary',
                    '&:hover': {
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
                      color: theme.palette.primary.main,
                    },
                    '&:hover p':{
                      color: theme.palette.primary.main
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon 
                    className="doc-icon"
                    sx={{ 
                      alignSelf: 'flex-start',
                      pt: 0.5,
                      minWidth: 36, 
                      color: isSelected ? theme.palette.primary.main : GREY[800],
                      transition: 'color 0.2s ease',
                    }}
                  >
                    <FileText size={20} />
                  </ListItemIcon>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: '16px',
                      color: isSelected ? theme.palette.primary.main : GREY[800],
                      textOverflow: 'ellipsis',
                      '&:hover': {
                        color: theme.palette.primary.main,
                      }
                    }}
                  >
                    {doc.title}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </Card>

        {/* Right Side: Simulated PDF Viewer Card */}
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: theme.customShadows.card,
            bgcolor: theme.palette.mode === 'light' ? '#2d2d2d' : '#14181F', // Dark gray/dark background representation
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            minHeight: '83vh',
            position: 'relative'
          }}
        >
          {/* PDF Viewer Top Toolbar */}
          <Box 
            sx={{ 
              bgcolor: theme.palette.mode === 'light' ? '#1E1E1E' : '#0B0D12', 
              color: '#FFFFFF',
              px: 2.5, 
              py: 1.5, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #444'
            }}
          >
            {/* Title / Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, maxWidth: '50%' }}>
              <FileText size={18} style={{ color: theme.palette.primary.light }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: '13px',
                  color: '#EEE',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeDoc.title}.pdf
              </Typography>
            </Box>

            {/* Middle Controls (Page Navigation & Zoom) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Pagination */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  disabled={currentPageNum === 1}
                  onClick={handlePrevPage}
                  sx={{ color: '#FFF', '&.Mui-disabled': { color: '#666' } }}
                >
                  <ChevronLeft size={18} />
                </IconButton>
                <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 600, minWidth: '60px', textAlign: 'center' }}>
                  {currentPageNum} / {maxPages}
                </Typography>
                <IconButton 
                  size="small" 
                  disabled={currentPageNum === maxPages}
                  onClick={handleNextPage}
                  sx={{ color: '#FFF', '&.Mui-disabled': { color: '#666' } }}
                >
                  <ChevronRight size={18} />
                </IconButton>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ bgcolor: '#444', height: 20, my: 'auto' }} />

              {/* Zoom */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton 
                  size="small" 
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 70}
                  sx={{ color: '#FFF', '&.Mui-disabled': { color: '#666' } }}
                >
                  <ZoomOut size={16} />
                </IconButton>
                <Typography variant="caption" sx={{ color: '#AAA', fontWeight: 600, minWidth: '35px', textAlign: 'center' }}>
                  {zoomScale}%
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 150}
                  sx={{ color: '#FFF', '&.Mui-disabled': { color: '#666' } }}
                >
                  <ZoomIn size={16} />
                </IconButton>
              </Box>
            </Box>

            {/* Right Controls (Action Buttons) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={handlePrint}
                sx={{ color: '#FFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                title="Print Document"
              >
                <Printer size={16} />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleDownload}
                sx={{ color: '#FFF', '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}
                title="Download PDF"
              >
                <Download size={16} />
              </IconButton>
            </Box>
          </Box>

          {/* PDF Viewer Main Canvas Area */}
          <Box
            sx={{
              flexGrow: 1,
              p: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'auto',
              maxHeight: '80vh',
              bgcolor: theme.palette.mode === 'light' ? '#3B3B3B' : '#14181F', // Real dark grey desktop background
            }}
          >
            {/* The Document Page */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '650px',
                bgcolor: '#FFFFFF', // Paper is always white for PDF feel
                color: '#1A1D23', // Dark text on paper
                p: 6,
                borderRadius: '2px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                transform: `scale(${zoomScale / 100})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                display: 'flex',
                flexDirection: 'column',
                gap: 3.5,
                minHeight: '800px', // Proper portrait paper ratio
              }}
            >
              {/* Document Header */}
              <Box sx={{ borderBottom: '2px solid #B81A80', pb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#B81A80' }}>
                    <Bookmark size={22} fill="#B81A80" />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 850, 
                        letterSpacing: '1.5px', 
                        textTransform: 'uppercase',
                        color: '#B81A80',
                        fontSize: '10px'
                      }}
                    >
                      Corporate Resource
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Page {currentPageNum} of {maxPages}
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#1A1D23', 
                    fontWeight: 750, 
                    mt: 1.5, 
                    fontSize: '22px',
                    fontFamily: 'Poppins, sans-serif' 
                  }}
                >
                  {activePage.title}
                </Typography>
              </Box>

              {/* Document Content Sections */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5, flexGrow: 1 }}>
                {activePage.sections.map((section, idx) => (
                  <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: '#1A1D23', 
                        fontWeight: 700, 
                        fontSize: '14px',
                        fontFamily: 'Poppins, sans-serif',
                        borderLeft: '3px solid #B81A80',
                        pl: 1.5
                      }}
                    >
                      {section.heading}
                    </Typography>
                    
                    {section.paragraphs.map((p, pIdx) => (
                      <Typography 
                        key={pIdx} 
                        variant="body2" 
                        sx={{ 
                          color: '#454F5B', 
                          lineHeight: 1.6, 
                          fontSize: '13px',
                          textAlign: 'justify'
                        }}
                      >
                        {p}
                      </Typography>
                    ))}

                    {section.listItems && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 1.2, 
                          pl: 1.5, 
                          mt: 1 
                        }}
                      >
                        {section.listItems.map((item, itemIdx) => (
                          <Box key={itemIdx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <CheckCircle size={15} style={{ color: '#B81A80', marginTop: '2px', flexShrink: 0 }} />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#454F5B', 
                                lineHeight: 1.5, 
                                fontSize: '13px' 
                              }}
                            >
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {/* Document Footer */}
              <Box 
                sx={{ 
                  borderTop: '1px solid #E4E7EB', 
                  pt: 2, 
                  mt: 'auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '10px' }}>
                  PC Connect LLC © 2026 • Confidential clinical resource
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '10px' }}>
                  REV. 06.26
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
