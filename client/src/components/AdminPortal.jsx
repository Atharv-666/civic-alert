import React, { useState } from 'react';
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
  Button,
  TextField,
  Chip,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ResolutionModal from './ResolutionModal';

export default function AdminPortal({ issues, onStatusChange }) {
  const [responseComment, setResponseComment] = useState('');
  const [resolutionModalIssue, setResolutionModalIssue] = useState(null);

  const totalCount = issues.length;
  const pendingCount = issues.filter((i) => i.status === 'Pending').length;
  const inProgressCount = issues.filter((i) => i.status === 'In Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  const handleUpdate = (issueId, newStatus) => {
    onStatusChange(issueId, newStatus, responseComment);
    setResponseComment('');
  };

  const handleResolutionSuccess = (issueId, newStatus, proofUrl) => {
    onStatusChange(issueId, newStatus, responseComment, proofUrl);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header Banner */}
      <Box
        className="glass-panel"
        sx={{
          p: 3,
          borderRadius: '20px',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          border: '1px solid rgba(99, 102, 241, 0.2)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', width: 44, height: 44 }}>
            <ShieldIcon />
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="Admin Portal" size="small" sx={{ backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', fontSize: '10px', fontWeight: 700 }} />
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Salokhenagar Municipal Division • Kolhapur
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 800, fontFamily: 'Outfit', mt: 0.5 }}>
              Municipal Authority Resolution Console
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card" sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderLeft: '4px solid #6366f1', borderRadius: '16px' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Total Reports
            </Typography>
            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 800, mt: 0.5 }}>
              {totalCount}
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card" sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderLeft: '4px solid #f59e0b', borderRadius: '16px' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Pending Queue
            </Typography>
            <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 800, mt: 0.5 }}>
              {pendingCount}
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card" sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderLeft: '4px solid #3b82f6', borderRadius: '16px' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              In Work Progress
            </Typography>
            <Typography variant="h4" sx={{ color: '#60a5fa', fontWeight: 800, mt: 0.5 }}>
              {inProgressCount}
            </Typography>
          </CardContent>
        </Card>

        <Card className="glass-card" sx={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderLeft: '4px solid #10b981', borderRadius: '16px' }}>
          <CardContent sx={{ p: 2.5 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
              Resolved Issues
            </Typography>
            <Typography variant="h4" sx={{ color: '#34d399', fontWeight: 800, mt: 0.5 }}>
              {resolvedCount}
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Response Comment Box */}
      <Box className="glass-panel" sx={{ p: 2.5, borderRadius: '16px' }}>
        <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 600, mb: 1, display: 'block' }}>
          Officer Response Note (Attaches to next status transition)
        </Typography>
        <TextField
          placeholder="e.g. Municipal road repair crew dispatched to Ward No. 4 Salokhenagar site..."
          size="small"
          fullWidth
          value={responseComment}
          onChange={(e) => setResponseComment(e.target.value)}
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '12px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
            '& .MuiInputBase-input': { color: '#ffffff', fontSize: '0.85rem' }
          }}
        />
      </Box>

      {/* Issues Queue Table */}
      <TableContainer
        component={Paper}
        className="glass-panel"
        sx={{
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}>
            <TableRow>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>EVIDENCE & PROOF</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>TITLE & LANDMARK</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>CATEGORY</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>STATUS</TableCell>
              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>ACTION CONTROLS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issues.map((issue) => (
              <TableRow key={issue._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', items: 'center', gap: 1 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <img
                        src={issue.imageUrl}
                        alt="Reported"
                        style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                      />
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '9px', display: 'block' }}>Before</Typography>
                    </Box>
                    {issue.resolutionImageUrl && (
                      <Box sx={{ textAlign: 'center' }}>
                        <img
                          src={issue.resolutionImageUrl}
                          alt="Proof"
                          style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '2px solid #10b981' }}
                        />
                        <Typography variant="caption" sx={{ color: '#34d399', fontSize: '9px', fontWeight: 700, display: 'block' }}>✓ Proof</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#ffffff' }}>
                    {issue.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#818cf8' }}>
                    📍 {issue.landmark}
                  </Typography>
                </TableCell>
                <TableCell sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{issue.category}</TableCell>
                <TableCell>
                  <Chip
                    label={issue.status}
                    size="small"
                    sx={{
                      backgroundColor:
                        issue.status === 'Pending'
                          ? 'rgba(245, 158, 11, 0.15)'
                          : issue.status === 'In Progress'
                          ? 'rgba(59, 130, 246, 0.15)'
                          : 'rgba(16, 185, 129, 0.15)',
                      color:
                        issue.status === 'Pending'
                          ? '#fbbf24'
                          : issue.status === 'In Progress'
                          ? '#60a5fa'
                          : '#34d399',
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      disabled={issue.status === 'In Progress'}
                      onClick={() => handleUpdate(issue._id, 'In Progress')}
                      sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '11px' }}
                    >
                      In Progress
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => setResolutionModalIssue(issue)}
                      sx={{ textTransform: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}
                    >
                      {issue.resolutionImageUrl ? 'Update Proof' : 'Resolve & Add Proof'}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Resolution Proof Upload Modal */}
      <ResolutionModal
        isOpen={Boolean(resolutionModalIssue)}
        onClose={() => setResolutionModalIssue(null)}
        issue={resolutionModalIssue}
        onSuccess={handleResolutionSuccess}
      />
    </Box>
  );
}
