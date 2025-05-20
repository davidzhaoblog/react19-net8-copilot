'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ErrorLogQuery, errorSeverityOptions, errorStateOptions } from '@/types/errorLog';
import {
    Paper,
    Grid,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Box,
    Typography,
    Collapse,
    IconButton,
    OutlinedInput,
    SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
    Search as SearchIcon,
    Clear as ClearIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/parseISO';

interface ErrorLogSearchPanelProps {
    initialQuery?: ErrorLogQuery;
    onSearch?: (query: ErrorLogQuery) => void;
}

export default function ErrorLogSearchPanel({ initialQuery, onSearch }: ErrorLogSearchPanelProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State for expanded/collapsed panel
    const [expanded, setExpanded] = useState(false);

    // Initialize form state from URL params or initialQuery
    const [formState, setFormState] = useState<ErrorLogQuery>({
        text: '',
        errorTimeFrom: undefined,
        errorTimeTo: undefined,
        errorSeverities: [],
        errorStates: [],
        ...initialQuery
    });

    // Effect to initialize form from URL on first load
    useEffect(() => {
        // Only run on initial mount
        if (searchParams) {
            const newState: ErrorLogQuery = {};

            // Text search
            if (searchParams.has('text')) {
                newState.text = searchParams.get('text') || '';
            }

            // Date ranges
            if (searchParams.has('errorTimeFrom')) {
                newState.errorTimeFrom = searchParams.get('errorTimeFrom') || undefined;
            }

            if (searchParams.has('errorTimeTo')) {
                newState.errorTimeTo = searchParams.get('errorTimeTo') || undefined;
            }

            // Multi-select arrays
            const severities = searchParams.getAll('errorSeverities');
            if (severities.length > 0) {
                newState.errorSeverities = severities.map(s => parseInt(s));
            }

            const states = searchParams.getAll('errorStates');
            if (states.length > 0) {
                newState.errorStates = states.map(s => parseInt(s));
            }

            // Merge with existing state to preserve any values not in URL
            setFormState(prev => ({ ...prev, ...newState }));

            // Auto-expand if there are search parameters
            if (severities.length > 0 || states.length > 0 || searchParams.has('text') ||
                searchParams.has('errorTimeFrom') || searchParams.has('errorTimeTo')) {
                setExpanded(true);
            }
        }
    }, []);

    // Handle input changes
    const handleChange = (name: keyof ErrorLogQuery) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            [name]: event.target.value
        });
    };

    // Handle date picker changes
    const handleDateChange = (name: 'errorTimeFrom' | 'errorTimeTo') => (date: Date | null) => {
        setFormState({
            ...formState,
            [name]: date ? format(date, 'yyyy-MM-dd') : undefined
        });
    };

    // Handle multi-select changes
    const handleMultiSelectChange = (name: 'errorSeverities' | 'errorStates') => (
        event: SelectChangeEvent<number[]>
    ) => {
        const value = event.target.value as number[];
        setFormState({
            ...formState,
            [name]: value
        });
    };

    // Handle search submission
    const handleSearch = () => {
        // Build query string
        const params = new URLSearchParams();

        // Add all non-empty parameters
        if (formState.text) {
            params.append('text', formState.text);
        }

        if (formState.errorTimeFrom) {
            params.append('errorTimeFrom', formState.errorTimeFrom);
        }

        if (formState.errorTimeTo) {
            params.append('errorTimeTo', formState.errorTimeTo);
        }

        // Handle arrays
        if (formState.errorSeverities && formState.errorSeverities.length > 0) {
            formState.errorSeverities.forEach(severity => {
                params.append('errorSeverities', severity.toString());
            });
        }

        if (formState.errorStates && formState.errorStates.length > 0) {
            formState.errorStates.forEach(state => {
                params.append('errorStates', state.toString());
            });
        }

        // Preserve pagination and sorting if they exist
        if (searchParams) {
            if (searchParams.has('page')) {
                params.append('page', '1'); // Reset to page 1 when searching
            }

            if (searchParams.has('pageSize')) {
                params.append('pageSize', searchParams.get('pageSize') || '12');
            }

            if (searchParams.has('orderBy')) {
                params.append('orderBy', searchParams.get('orderBy') || 'ErrorTime desc');
            }
        }

        // Update URL
        router.push(`${pathname}?${params.toString()}`);

        // Call the onSearch callback if provided
        if (onSearch) {
            onSearch(formState);
        }
    };

    // Handle clear/reset
    const handleClear = () => {
        // Reset form state
        setFormState({
            text: '',
            errorTimeFrom: undefined,
            errorTimeTo: undefined,
            errorSeverities: [],
            errorStates: []
        });

        // Clear URL params but preserve pagination and sorting
        const params = new URLSearchParams();

        if (searchParams) {
            if (searchParams.has('pageSize')) {
                params.append('pageSize', searchParams.get('pageSize') || '12');
            }

            if (searchParams.has('orderBy')) {
                params.append('orderBy', searchParams.get('orderBy') || 'ErrorTime desc');
            }
        }

        // Update URL (either with just pagination/sorting or empty)
        router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`);

        // Call the onSearch callback with empty query if provided
        if (onSearch) {
            onSearch({});
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: expanded ? 2 : 0 }}>

                <TextField
                    fullWidth
                    label="Search Text"
                    placeholder="Search in error messages, procedures, usernames..."
                    value={formState.text || ''}
                    onChange={handleChange('text')}
                    variant="outlined"
                    size="small"
                    // Add InputProps with clear button
                    slotProps={{input : {
                        endAdornment: formState.text ? (
                            <IconButton
                                aria-label="clear search text"
                                onClick={() => {
                                    setFormState({
                                        ...formState,
                                        text: ''
                                    });
                                }}
                                edge="end"
                                size="small"
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        ) : null,
                    }}}
                />

                <IconButton onClick={handleSearch} size="small">
                    <SearchIcon />
                </IconButton>
                <IconButton onClick={() => setExpanded(!expanded)} size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Grid container spacing={2}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <DatePicker
                                label="Error From Date"
                                value={formState.errorTimeFrom ? parseISO(formState.errorTimeFrom) : null}
                                onChange={handleDateChange('errorTimeFrom')}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <DatePicker
                                label="Error To Date"
                                value={formState.errorTimeTo ? parseISO(formState.errorTimeTo) : null}
                                onChange={handleDateChange('errorTimeTo')}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>
                    </LocalizationProvider>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="error-severities-label">Error Severities</InputLabel>
                            <Select
                                labelId="error-severities-label"
                                multiple
                                value={formState.errorSeverities || []}
                                onChange={handleMultiSelectChange('errorSeverities')}
                                input={<OutlinedInput label="Error Severities" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={errorSeverityOptions.find(opt => opt.value === value)?.label || value}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {errorSeverityOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="error-states-label">Error States</InputLabel>
                            <Select
                                labelId="error-states-label"
                                multiple
                                value={formState.errorStates || []}
                                onChange={handleMultiSelectChange('errorStates')}
                                input={<OutlinedInput label="Error States" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={errorStateOptions.find(opt => opt.value === value)?.label || value}
                                                size="small"
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {errorStateOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<ClearIcon />}
                            onClick={handleClear}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                        >
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Collapse>
        </Paper>
    );
}