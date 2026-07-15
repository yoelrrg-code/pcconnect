import { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Button, 
  InputAdornment, 
  Link, 
  useTheme, 
  alpha,
  TablePagination,
  Card,
  IconButton
} from '@mui/material';
import { Search, Filter, Download, MessageSquare } from 'lucide-react';
import { fadeInUp } from '../../../theme/effects';

import {
  MOCK_PC_QUEUE,
  MOCK_WAITING_REVIEW
} from './active-incomplete-cases-mock';
import type { PCQueueCase, WaitingReviewCase } from './active-incomplete-cases-mock';

interface ActiveIncompleteCasesDetailsViewProps {
  providerName: string;
  onBack: () => void;
  onSelectAccount?: (accountNum: string, rowData: PCQueueCase | WaitingReviewCase) => void;
}

export default function ActiveIncompleteCasesDetailsView({ providerName, onBack, onSelectAccount }: ActiveIncompleteCasesDetailsViewProps) {
  const theme = useTheme();

  // PC Queue State
  const [pcSearch, setPcSearch] = useState('');
  const [pcShowFilters, setPcShowFilters] = useState(true);
  const [pcPage, setPcPage] = useState(0);
  const [pcRowsPerPage, setPcRowsPerPage] = useState(10);
  
  // PC Queue Inline Filters
  const [filterPcCreated, setFilterPcCreated] = useState('');
  const [filterPcAccount, setFilterPcAccount] = useState('');
  const [filterPcMrn, setFilterPcMrn] = useState('');
  const [filterPcDos, setFilterPcDos] = useState('');
  const [filterPcPatient, setFilterPcPatient] = useState('');
  const [filterPcProvider, setFilterPcProvider] = useState('');
  const [filterPcScribe, setFilterPcScribe] = useState('');
  const [filterPcReason, setFilterPcReason] = useState('');
  const [filterPcComment, setFilterPcComment] = useState('');
  const [filterPcSubmitted, setFilterPcSubmitted] = useState('');

  // Waiting Review State
  const [wrSearch, setWrSearch] = useState('');
  const [wrShowFilters, setWrShowFilters] = useState(true);
  const [wrPage, setWrPage] = useState(0);
  const [wrRowsPerPage, setWrRowsPerPage] = useState(10);

  // Waiting Review Inline Filters
  const [filterWrAccount, setFilterWrAccount] = useState('');
  const [filterWrMrn, setFilterWrMrn] = useState('');
  const [filterWrDos, setFilterWrDos] = useState('');
  const [filterWrPatient, setFilterWrPatient] = useState('');
  const [filterWrProvider, setFilterWrProvider] = useState('');
  const [filterWrScribe, setFilterWrScribe] = useState('');
  const [filterWrReason, setFilterWrReason] = useState('');
  const [filterWrComment, setFilterWrComment] = useState('');
  const [filterWrSubmitted, setFilterWrSubmitted] = useState('');

  // PC Queue Filtering
  const filteredPcQueue = useMemo(() => {
    return MOCK_PC_QUEUE.filter((item) => {
      const matchesGlobal = pcSearch === '' ||
        item.createdInConnect.includes(pcSearch) ||
        item.account.includes(pcSearch) ||
        item.mrn.toLowerCase().includes(pcSearch.toLowerCase()) ||
        item.dos.includes(pcSearch) ||
        item.patientName.toLowerCase().includes(pcSearch.toLowerCase()) ||
        item.provider.toLowerCase().includes(pcSearch.toLowerCase()) ||
        item.reason.toLowerCase().includes(pcSearch.toLowerCase()) ||
        item.lastComment.toLowerCase().includes(pcSearch.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(pcSearch.toLowerCase());

      const matchesCreated = filterPcCreated === '' || item.createdInConnect.includes(filterPcCreated);
      const matchesAccount = filterPcAccount === '' || item.account.includes(filterPcAccount);
      const matchesMrn = filterPcMrn === '' || item.mrn.toLowerCase().includes(filterPcMrn.toLowerCase());
      const matchesDos = filterPcDos === '' || item.dos.includes(filterPcDos);
      const matchesPatient = filterPcPatient === '' || item.patientName.toLowerCase().includes(filterPcPatient.toLowerCase());
      const matchesProvider = filterPcProvider === '' || item.provider.toLowerCase().includes(filterPcProvider.toLowerCase());
      const matchesScribe = filterPcScribe === '' || item.scribe.toLowerCase().includes(filterPcScribe.toLowerCase());
      const matchesReason = filterPcReason === '' || item.reason.toLowerCase().includes(filterPcReason.toLowerCase());
      const matchesComment = filterPcComment === '' || item.lastComment.toLowerCase().includes(filterPcComment.toLowerCase());
      const matchesSubmitted = filterPcSubmitted === '' || item.submittedBy.toLowerCase().includes(filterPcSubmitted.toLowerCase()) || (item.submittedTime && item.submittedTime.toLowerCase().includes(filterPcSubmitted.toLowerCase()));

      return matchesGlobal && matchesCreated && matchesAccount && matchesMrn && matchesDos && matchesPatient && matchesProvider && matchesScribe && matchesReason && matchesComment && matchesSubmitted;
    });
  }, [pcSearch, filterPcCreated, filterPcAccount, filterPcMrn, filterPcDos, filterPcPatient, filterPcProvider, filterPcScribe, filterPcReason, filterPcComment, filterPcSubmitted]);

  // Waiting Review Filtering
  const filteredWaitingReview = useMemo(() => {
    return MOCK_WAITING_REVIEW.filter((item) => {
      const matchesGlobal = wrSearch === '' ||
        item.account.includes(wrSearch) ||
        item.mrn.toLowerCase().includes(wrSearch.toLowerCase()) ||
        item.dos.includes(wrSearch) ||
        item.patientName.toLowerCase().includes(wrSearch.toLowerCase()) ||
        item.provider.toLowerCase().includes(wrSearch.toLowerCase()) ||
        item.reason.toLowerCase().includes(wrSearch.toLowerCase()) ||
        item.lastComment.toLowerCase().includes(wrSearch.toLowerCase()) ||
        item.submittedBy.toLowerCase().includes(wrSearch.toLowerCase());

      const matchesAccount = filterWrAccount === '' || item.account.includes(filterWrAccount);
      const matchesMrn = filterWrMrn === '' || item.mrn.toLowerCase().includes(filterWrMrn.toLowerCase());
      const matchesDos = filterWrDos === '' || item.dos.includes(filterWrDos);
      const matchesPatient = filterWrPatient === '' || item.patientName.toLowerCase().includes(filterWrPatient.toLowerCase());
      const matchesProvider = filterWrProvider === '' || item.provider.toLowerCase().includes(filterWrProvider.toLowerCase());
      const matchesScribe = filterWrScribe === '' || item.scribe.toLowerCase().includes(filterWrScribe.toLowerCase());
      const matchesReason = filterWrReason === '' || item.reason.toLowerCase().includes(filterWrReason.toLowerCase());
      const matchesComment = filterWrComment === '' || item.lastComment.toLowerCase().includes(filterWrComment.toLowerCase());
      const matchesSubmitted = filterWrSubmitted === '' || item.submittedBy.toLowerCase().includes(filterWrSubmitted.toLowerCase()) || (item.submittedTime && item.submittedTime.toLowerCase().includes(filterWrSubmitted.toLowerCase()));

      return matchesGlobal && matchesAccount && matchesMrn && matchesDos && matchesPatient && matchesProvider && matchesScribe && matchesReason && matchesComment && matchesSubmitted;
    });
  }, [wrSearch, filterWrAccount, filterWrMrn, filterWrDos, filterWrPatient, filterWrProvider, filterWrScribe, filterWrReason, filterWrComment, filterWrSubmitted]);

  const visiblePcQueue = useMemo(() => {
    return filteredPcQueue.slice(pcPage * pcRowsPerPage, pcPage * pcRowsPerPage + pcRowsPerPage);
  }, [filteredPcQueue, pcPage, pcRowsPerPage]);

  const visibleWaitingReview = useMemo(() => {
    return filteredWaitingReview.slice(wrPage * wrRowsPerPage, wrPage * wrRowsPerPage + wrRowsPerPage);
  }, [filteredWaitingReview, wrPage, wrRowsPerPage]);

  const handleExportPc = () => {
    const headers = ['Created in Connect', 'Account#', 'MR#', 'DOS', 'PatientName', 'Provider', 'Scribe', 'Reason', 'Last Comment', 'Submitted By'];
    const rows = filteredPcQueue.map(p => [
      `"${p.createdInConnect} ${p.createdTime}"`,
      `"${p.account}"`,
      `"${p.mrn}"`,
      `"${p.dos}"`,
      `"${p.patientName}"`,
      `"${p.provider}"`,
      `"${p.scribe}"`,
      `"${p.reason}"`,
      `"${p.lastComment}"`,
      `"${p.submittedBy} ${p.submittedTime || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pc_queue_cases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWr = () => {
    const headers = ['Account#', 'MR#', 'DOS', 'PatientName', 'Provider', 'Scribe', 'Reason', 'Last Comment', 'Submitted By'];
    const rows = filteredWaitingReview.map(p => [
      `"${p.account}"`,
      `"${p.mrn}"`,
      `"${p.dos}"`,
      `"${p.patientName}"`,
      `"${p.provider}"`,
      `"${p.scribe}"`,
      `"${p.reason}"`,
      `"${p.lastComment}"`,
      `"${p.submittedBy} ${p.submittedTime || ''}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "waiting_review_cases.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ animation: `${fadeInUp} 0.3s ease-in-out` }}>
      
      {/* Title & Breadcrumbs */}
      <Box sx={{ mb: 3.75 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cases for {providerName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            Dashboard
          </Link>
          <Typography sx={{ color: 'text.secondary', fontSize: '16px' }}>{'>'}</Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '16px', fontWeight: 600 }}>Provider</Typography>
        </Box>
      </Box>

      {/* 1. PC Queue (Need PC review and/or in process) */}
      <Card sx={{ mb: 4, borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: 'none' }}>

        {/* Toolbar */}
        <Box sx={{ px: 2.5, pt: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h5" sx={{ color: theme.palette.primary.light, width: '100%' }}>
            PC Queue (Need PC review and/or in process)
          </Typography>

          <TextField
            size="small"
            placeholder="Search..."
            value={pcSearch}
            onChange={(e) => {
              setPcSearch(e.target.value);
              setPcPage(0);
            }}
            slotProps={{
              input: {
                className: 'large',
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: theme.palette.text.disabled }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: 1, sm: 300 } }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="toolbar"
            color="inherit"
            startIcon={<Filter size={16} />}
            onClick={() => setPcShowFilters(!pcShowFilters)}
          >
            Filters
          </Button>
          <Button
            variant="toolbar"
            color="inherit"
            startIcon={<Download size={16} />}
            onClick={handleExportPc}
          >
            Export
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 1500 }} aria-label="pc queue cases table">
            <TableHead>
              <TableRow>
                <TableCell>Created in Connect</TableCell>
                <TableCell>Account#</TableCell>
                <TableCell>MR#</TableCell>
                <TableCell>DOS</TableCell>
                <TableCell>PatientName</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Scribe</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Last Comment</TableCell>
                <TableCell>Submitted By</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {pcShowFilters && (
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcCreated} onChange={(e) => { setFilterPcCreated(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcAccount} onChange={(e) => { setFilterPcAccount(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcMrn} onChange={(e) => { setFilterPcMrn(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcDos} onChange={(e) => { setFilterPcDos(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcPatient} onChange={(e) => { setFilterPcPatient(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcProvider} onChange={(e) => { setFilterPcProvider(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcScribe} onChange={(e) => { setFilterPcScribe(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcReason} onChange={(e) => { setFilterPcReason(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcComment} onChange={(e) => { setFilterPcComment(e.target.value); setPcPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterPcSubmitted} onChange={(e) => { setFilterPcSubmitted(e.target.value); setPcPage(0); }} /></TableCell>
                </TableRow>
              )}

              {visiblePcQueue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No cases found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                visiblePcQueue.map((row, index) => {
                  const isCream = index % 2 === 0;
                  const rowBg = theme.palette.mode === 'light' 
                    ? (isCream ? '#FEF4E4' : '#FFFFFF')
                    : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');

                  return (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        bgcolor: rowBg,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.primary.hover
                        }
                      }}
                    >
                      {/* Created in Connect */}
                      <TableCell sx={{ fontSize: '14px' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary' }}>
                            {row.createdInConnect}
                          </Typography>
                          {row.createdTime && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.2 }}>
                              {row.createdTime}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      {/* Account */}
                      <TableCell>
                        <Link 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); onSelectAccount?.(row.account, row); }}
                          sx={{ 
                            fontSize: '14px',
                            fontWeight: 500, 
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                        >
                          {row.account}
                        </Link>
                      </TableCell>

                      {/* MR# */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.mrn}</TableCell>

                      {/* DOS */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.dos}</TableCell>

                      {/* Patient Name */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.patientName}</TableCell>

                      {/* Provider */}
                      <TableCell sx={{ fontSize: '14px' }}>
                        {row.provider ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 500 }}>
                              {row.provider}
                            </Typography>
                            {row.providerEmail && (
                              <Link
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                sx={{ fontSize: '11px', color: 'text.secondary', textDecoration: 'underline' }}
                              >
                                {row.providerEmail}
                              </Link>
                            )}
                          </Box>
                        ) : ''}
                      </TableCell>

                      {/* Scribe */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.scribe}</TableCell>

                      {/* Reason */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.reason}</TableCell>

                      {/* Last Comment */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.lastComment}</TableCell>

                      {/* Submitted By & Chat icon */}
                      <TableCell sx={{ fontSize: '14px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          {row.submittedBy ? (
                            <Box>
                              <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary' }}>
                                {row.submittedBy}
                              </Typography>
                              {row.submittedTime && (
                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                  {row.submittedTime}
                                </Typography>
                              )}
                            </Box>
                          ) : <Box />}
                          {row.hasCommentIcon && (
                            <IconButton size="small" sx={{ color: theme.palette.text.secondary }}>
                              <MessageSquare size={16} />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPcQueue.length}
            rowsPerPage={pcRowsPerPage}
            page={pcPage}
            onPageChange={(_e, newPage) => setPcPage(newPage)}
            onRowsPerPageChange={(e) => { setPcRowsPerPage(parseInt(e.target.value, 10)); setPcPage(0); }}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
          />
        </TableContainer>
      </Card>

      {/* 2. Waiting for Review from Client */}
      <Card sx={{ borderRadius: 2, bgcolor: theme.palette.background.paper, boxShadow: 'none' }}>
      
        {/* Toolbar */}
        <Box sx={{ px: 2.5, pt: 2.5, display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h5" sx={{ color: theme.palette.primary.light, width: '100%' }}>
            Waiting for Review from Client
          </Typography>

          <TextField
            size="small"
            placeholder="Search..."
            value={wrSearch}
            onChange={(e) => {
              setWrSearch(e.target.value);
              setWrPage(0);
            }}
            slotProps={{
              input: {
                className: 'large',
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: theme.palette.text.disabled }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: 1, sm: 300 } }}
          />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="toolbar"
            color="inherit"
            startIcon={<Filter size={16} />}
            onClick={() => setWrShowFilters(!wrShowFilters)}
          >
            Filters
          </Button>
          <Button
            variant="toolbar"
            color="inherit"
            startIcon={<Download size={16} />}
            onClick={handleExportWr}
          >
            Export
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 1500 }} aria-label="waiting review cases table">
            <TableHead>
              <TableRow>
                <TableCell>Account#</TableCell>
                <TableCell>MR#</TableCell>
                <TableCell>DOS</TableCell>
                <TableCell>PatientName</TableCell>
                <TableCell>Provider</TableCell>
                <TableCell>Scribe</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Last Comment</TableCell>
                <TableCell>Submitted By</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {wrShowFilters && (
                <TableRow sx={{ bgcolor: theme.palette.mode === 'light' ? '#FCFDFE' : '#212B36' }}>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrAccount} onChange={(e) => { setFilterWrAccount(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrMrn} onChange={(e) => { setFilterWrMrn(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrDos} onChange={(e) => { setFilterWrDos(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrPatient} onChange={(e) => { setFilterWrPatient(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrProvider} onChange={(e) => { setFilterWrProvider(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrScribe} onChange={(e) => { setFilterWrScribe(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrReason} onChange={(e) => { setFilterWrReason(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrComment} onChange={(e) => { setFilterWrComment(e.target.value); setWrPage(0); }} /></TableCell>
                  <TableCell sx={{ p: 1.5 }}><TextField size="small" label="Contains" value={filterWrSubmitted} onChange={(e) => { setFilterWrSubmitted(e.target.value); setWrPage(0); }} /></TableCell>
                </TableRow>
              )}

              {visibleWaitingReview.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No cases found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                visibleWaitingReview.map((row, index) => {
                  const isCream = index % 2 === 0;
                  const rowBg = theme.palette.mode === 'light' 
                    ? (isCream ? '#FEF4E4' : '#FFFFFF')
                    : (isCream ? alpha(theme.palette.primary.main, 0.04) : 'transparent');

                  return (
                    <TableRow 
                      key={row.id}
                      sx={{ 
                        bgcolor: rowBg,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.primary.hover
                        }
                      }}
                    >
                      {/* Account */}
                      <TableCell>
                        <Link 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); onSelectAccount?.(row.account, row); }}
                          sx={{ 
                            fontSize: '14px',
                            fontWeight: 500, 
                            color: theme.palette.primary.main,
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                        >
                          {row.account}
                        </Link>
                      </TableCell>

                      {/* MR# */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.mrn}</TableCell>

                      {/* DOS */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.dos}</TableCell>

                      {/* Patient Name */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.patientName}</TableCell>

                      {/* Provider */}
                      <TableCell sx={{ fontSize: '14px' }}>
                        {row.provider ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 500 }}>
                              {row.provider}
                            </Typography>
                            {row.providerEmail && (
                              <Link
                                href="#"
                                onClick={(e) => e.preventDefault()}
                                sx={{ fontSize: '11px', color: 'text.secondary', textDecoration: 'underline' }}
                              >
                                {row.providerEmail}
                              </Link>
                            )}
                          </Box>
                        ) : ''}
                      </TableCell>

                      {/* Scribe */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.scribe}</TableCell>

                      {/* Reason */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.reason}</TableCell>

                      {/* Last Comment */}
                      <TableCell sx={{ fontSize: '14px' }}>{row.lastComment}</TableCell>

                      {/* Submitted By */}
                      <TableCell sx={{ fontSize: '14px' }}>
                        {row.submittedBy ? (
                          <Box>
                            <Typography variant="body2" sx={{ fontSize: '14px', color: 'text.primary' }}>
                              {row.submittedBy}
                            </Typography>
                            {row.submittedTime && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {row.submittedTime}
                              </Typography>
                            )}
                          </Box>
                        ) : ''}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredWaitingReview.length}
            rowsPerPage={wrRowsPerPage}
            page={wrPage}
            onPageChange={(_e, newPage) => setWrPage(newPage)}
            onRowsPerPageChange={(e) => { setWrRowsPerPage(parseInt(e.target.value, 10)); setWrPage(0); }}
            sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
          />
        </TableContainer>
      </Card>
    </Box>
  );
}
