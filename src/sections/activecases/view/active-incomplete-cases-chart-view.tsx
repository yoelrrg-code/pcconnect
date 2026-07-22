import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  TextField, 
  Button, 
  Link, 
  IconButton, 
  Grid,
  useTheme
} from '@mui/material';
import { ChevronLeft } from 'lucide-react';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import { fadeInUp } from '../../../theme/effects';

// ----------------------------------------------------------------------

interface CaseRowData {
  createdInConnect?: string;
  mrn?: string;
  patientName?: string;
  dos?: string;
  provider?: string;
  providerEmail?: string;
  reason?: string;
  lastCommentDate?: string;
}

interface ChartInfo {
  dateCreated: string;
  account: string;
  mrn: string;
  patientName: string;
  dos: string;
  provider: string;
  email: string;
  reason: string;
  incompleteDate: string;
  receivedDate: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  authorEmail?: string;
  timestamp: string;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', py: 0.8, fontSize: '16px', alignItems: 'center' }}>
    <Typography sx={{ width: 160, color: 'text.secondary', fontSize: '16px', fontWeight: 400 }}>
      {label}
    </Typography>
    <Typography sx={{ maxWidth: 300, color: 'text.primary', fontSize: '16px' }}>
      {value || '—'}
    </Typography>
  </Box>
);

const MOCK_COMMENT_POOL = [
  { text: 'Changes made to Chart', author: 'Benoit', authorEmail: 'rbenoit1@yahoo.com', timestamp: '04/27/2026 8:04 am' },
  { text: 'Correct chart has been downloaded. Nothing needed at this time, thank you.', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '04/15/2026 2:19 pm' },
  { text: 'Waiting for signature', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '06/08/2026 10:00 am' },
  { text: 'Patient signed out to unknown oncoming provider.', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '05/07/2026 3:12 pm' },
  { text: 'Please confirm electrocardioversion was performed on this patient and if so provide supporting diagnosis.', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '05/07/2026 2:38 pm' },
  { text: 'Need details of blister drainage', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '05/07/2026 1:51 pm' },
  { text: 'Exam shows only the patients vitals.', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '04/22/2026 2:46 pm' },
  { text: 'Did you sign the patient out to another provider?', author: 'Franklyn', authorEmail: 'franklyn@yahoo.com', timestamp: '04/22/2026 2:44 pm' },
  { text: 'Provider signature is missing on the final page.', author: 'Elena', authorEmail: 'elena.c@connect.com', timestamp: '05/12/2026 11:20 am' },
  { text: 'Chart review completed. Scribing discrepancies resolved.', author: 'David', authorEmail: 'd.miller@connect.com', timestamp: '05/18/2026 9:45 am' },
];

const getCommentsForAccount = (accountNum: string): Comment[] => {
  let hash = 0;
  for (let i = 0; i < accountNum.length; i++) {
    hash = accountNum.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  // Cantidad de comentarios: entre 2 y 4
  const count = (positiveHash % 3) + 2; 

  const result: Comment[] = [];
  for (let i = 0; i < count; i++) {
    const poolIndex = (positiveHash + i * 7) % MOCK_COMMENT_POOL.length;
    const item = MOCK_COMMENT_POOL[poolIndex];
    result.push({
      id: `${accountNum}-${i}`,
      text: item.text,
      author: item.author,
      authorEmail: item.authorEmail,
      timestamp: item.timestamp,
    });
  }
  return result;
};

interface ActiveIncompleteCasesChartViewProps {
  providerName: string;
  accountNumber: string;
  accountData?: CaseRowData;
  onBack: () => void;
  onBackToDashboard: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function ActiveIncompleteCasesChartView({
  providerName,
  accountNumber,
  accountData,
  onBack,
  onBackToDashboard,
  onPrevious,
  onNext
}: ActiveIncompleteCasesChartViewProps) {
  const theme = useTheme();
  
  // Local comments state
  const [comments, setComments] = useState<Comment[]>(() => getCommentsForAccount(accountNumber));
  const [newComment, setNewComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const now = new Date();
    const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()} ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
    
    const comment: Comment = {
      id: String(Date.now()),
      text: newComment,
      author: 'You',
      timestamp: formattedDate
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  // Populate dynamic chart info, fallback to screenshot values if not present
  const info: ChartInfo = {
    dateCreated: accountData?.createdInConnect || '05/06/2026',
    account: accountNumber,
    mrn: accountData?.mrn || 'M000153405',
    patientName: accountData?.patientName || 'HO**, C*',
    dos: accountData?.dos || '03/22/2026',
    provider: accountData?.provider || 'LEON-ALBARRAN, MIGUEL',
    email: accountData?.providerEmail || 'miguel.leonmeds@gmail.com',
    reason: accountData?.reason || '921 Provider\'s signature is missing',
    incompleteDate: accountData?.lastCommentDate || '05/04/2026',
    receivedDate: '04/30/2026'
  };

  return (
    <Box sx={{ mb: 5, animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* Title & Chevron Back */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', pl: 0, ml: 0 }}>
        <IconButton onClick={onBack} sx={{ p: 0.5, pl: 0, ml: -1, color: 'text.primary' }}>
          <ChevronLeft size={24} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Chart Account# {info.account} for {providerName}
        </Typography>
      </Box>

      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3.75}}>
        <Link 
          href="#" 
          onClick={(e) => { e.preventDefault(); onBackToDashboard(); }}
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none', 
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          Dashboard
        </Link>
        <Typography sx={{ color: 'text.secondary', fontSize: '16px' }}>{'>'}</Typography>
        <Link 
          href="#" 
          onClick={(e) => { e.preventDefault(); onBack(); }}
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none', 
            fontSize: '16px',
            fontWeight: 600,
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          Provider
        </Link>
        <Typography sx={{ color: 'text.secondary', fontSize: '16px' }}>{'>'}</Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '16px', fontWeight: 600 }}>Chart</Typography>
      </Box>

      {/* Info Card */}
      <Card sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Info
        </Typography>
        
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoRow label="Date Created" value={info.dateCreated} />
            <InfoRow label="Account#" value={info.account} />
            <InfoRow label="MR#" value={info.mrn} />
            <InfoRow label="Patient Name" value={info.patientName} />
            <InfoRow label="DOS" value={info.dos} />
          </Grid>
          
          {/* Right Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <InfoRow label="Provider" value={info.provider} />
            <InfoRow label="Email" value={info.email} />
            <InfoRow label="Reason" value={info.reason} />
            <InfoRow label="Incomplete Date" value={info.incompleteDate} />
            <InfoRow label="Received Date" value={info.receivedDate} />
          </Grid>
        </Grid>
      </Card>

      {/* Comment History Card */}
      <Card sx={{ p: 3, mb: 5, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: 'none' }}>
        <Typography variant="h5" sx={{ mb: 3, pb: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          Comment History
        </Typography>

        {/* Existing Comments */}
        <Box sx={{ mb: 4, position: 'relative' }}>
          {comments.length > 0 && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                bottom: 24, 
                left: 5, 
                width: '2px', 
                bgcolor: 'grey.200',
                zIndex: 1
              }} 
            />
          )}

          {comments.length === 0 ? (
            <Typography sx={{ color: 'text.primary', fontSize: '16px', mb: 6}}>
              No comments available.
            </Typography>
          ) : (
            comments.map((comment) => (
              <Box key={comment.id} sx={{ position: 'relative', pl: 3.5, mb: 3 }}>
                {/* Timeline Circle */}
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    left: 0, 
                    top: 6, 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: 'info.main', 
                    zIndex: 2 
                  }} 
                />

                {/* Comment Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '16px', fontWeight: 600, color: 'text.primary' }}>
                    {comment.text}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '14px', color: 'text.secondary' }}>
                    <span>{comment.author}</span>
                    {comment.authorEmail && (
                      <Link 
                        href={`mailto:${comment.authorEmail}`} 
                        sx={{ 
                          color: 'text.secondary', 
                          textDecoration: 'underline',
                          '&:hover': { color: 'primary.main' }
                        }}
                      >
                        {comment.authorEmail}
                      </Link>
                    )}
                  </Box>

                  <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                    {comment.timestamp}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* New Comment Input */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label={
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                <AddCommentOutlinedIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <span style={{ fontSize: '14px', fontWeight: 400 }}>Write a comment...</span>
              </Box>
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete='off'
            slotProps={{
              inputLabel: {
                shrink: isFocused || !!newComment
              },
              input: {
                notched: false
              }
            }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline legend': {
                position: 'absolute',
                top: '-4px',
                zIndex: 123,
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                height: '45px',
              },
              '& .MuiInputLabel-root': {
                transform: 'translate(14px, 12px) scale(1)',
              },
              '& .MuiInputLabel-shrink': {
                transform: 'translate(12px, -9px) scale(0.75)',
                backgroundColor: theme.palette.background.paper,
                padding: '0 6px',
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="modalAdd"
              onClick={handleAddComment}
            >
              Add Comment
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Footer Navigation Links */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, px: 1 }}>
        <Link 
          href="#" 
          onClick={(e) => { e.preventDefault(); onPrevious?.(); }}
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none', 
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          {'<'} Previous
        </Link>
        <Link 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNext?.(); }}
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none', 
            fontWeight: 600,
            fontSize: '16px',
            '&:hover': { textDecoration: 'underline' } 
          }}
        >
          Next {'>'}
        </Link>
      </Box>
    </Box>
  );
}
