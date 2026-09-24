import React, { useState } from 'react';
import IssueCard from './IssueCard';
import { Tabs, Tab, TextField, MenuItem, Box, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

export default function IssueFeed({ issues, onUpvote, onStatusChange, isAdmin }) {
  const [statusTab, setStatusTab] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Roads & Potholes',
    'Water Supply',
    'Waste Management',
    'Street Lighting',
    'Drainage & Sewage',
    'Public Safety',
    'Other'
  ];

  const filteredIssues = issues.filter((issue) => {
    const matchesStatus = statusTab === 'All' || issue.status === statusTab;
    const matchesCategory = categoryFilter === 'All' || issue.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.landmark.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <Box sx={{ spaceY: 4 }}>
      {/* Controls & Filter Bar */}
      <Box
        className="glass-panel"
        sx={{
          p: 2.5,
          borderRadius: '20px',
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justify: 'space-between',
          gap: 2
        }}
      >
        {/* Status Tabs */}
        <Tabs
          value={statusTab}
          onChange={(e, val) => setStatusTab(val)}
          sx={{
            minHeight: '40px',
            '& .MuiTabs-indicator': { backgroundColor: '#6366f1', height: '3px', borderRadius: '3px' },
            '& .MuiTab-root': {
              color: '#94a3b8',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.85rem',
              minHeight: '40px',
              px: 2,
              '&.Mui-selected': { color: '#ffffff' }
            }
          }}
        >
          <Tab label="All Reports" value="All" />
          <Tab label="Pending" value="Pending" />
          <Tab label="In Progress" value="In Progress" />
          <Tab label="Resolved" value="Resolved" />
        </Tabs>

        {/* Search & Category Filter */}
        <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
          <TextField
            placeholder="Search Salokhenagar issues..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b', fontSize: 20 }} />
                </InputAdornment>
              )
            }}
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              width: { xs: '100%', md: '240px' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(99, 102, 241, 0.4)' },
              '& .MuiInputBase-input': { color: '#ffffff', fontSize: '0.85rem' }
            }}
          />

          <TextField
            select
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FilterListIcon sx={{ color: '#64748b', fontSize: 18 }} />
                </InputAdornment>
              )
            }}
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '12px',
              minWidth: '160px',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.1)' },
              '& .MuiSelect-select': { color: '#ffffff', fontSize: '0.85rem' }
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ fontSize: '0.85rem' }}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>

      {/* Grid Display */}
      {filteredIssues.length === 0 ? (
        <Box
          className="glass-panel"
          sx={{
            p: 8,
            borderRadius: '20px',
            textAlign: 'center',
            color: '#94a3b8'
          }}
        >
          <Typography variant="h6" sx={{ color: '#e2e8f0', fontWeight: 600 }}>
            No community reports found.
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            Be the first resident to report a civic issue in Salokhenagar!
          </Typography>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onUpvote={onUpvote}
              onStatusChange={onStatusChange}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </Box>
  );
}
