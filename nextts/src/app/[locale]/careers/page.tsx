import { Metadata } from 'next';
import { Box, Container, Typography, Paper, Grid, Button, Chip, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Work, LocationOn, AccessTime, Check } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'careers' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

// Mock job listings - in a real app, this would come from an API or CMS
const jobListings = [
    {
        id: 'frontend-developer',
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Remote / New York',
        type: 'Full-time',
        posted: '2023-09-15',
    },
    {
        id: 'backend-developer',
        title: 'Backend Developer',
        department: 'Engineering',
        location: 'Remote / San Francisco',
        type: 'Full-time',
        posted: '2023-09-10',
    },
    {
        id: 'product-designer',
        title: 'Product Designer',
        department: 'Design',
        location: 'London',
        type: 'Full-time',
        posted: '2023-09-05',
    },
    {
        id: 'marketing-manager',
        title: 'Marketing Manager',
        department: 'Marketing',
        location: 'Remote / Berlin',
        type: 'Full-time',
        posted: '2023-08-28',
    },
];

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'careers' });

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    {t('title')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
                    {t('subtitle')}
                </Typography>
            </Box>

            <Box sx={{ position: 'relative', height: 400, width: '100%', mb: 6 }}>
                <Image
                    src="/images/careers/team-hero.jpg"
                    alt={t('heroImageAlt')}
                    fill
                    priority
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
            </Box>

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    {t('whyJoin.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                    {t('whyJoin.subtitle')}
                </Typography>

                <Grid container spacing={4}>
                    {['growth', 'impact', 'balance', 'benefits'].map((benefit) => (
                        <Grid size={12} key={benefit}>
                            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', mb: 2 }}>
                                    <Box sx={{ width: 50, height: 50, mr: 2 }}>
                                        <Image
                                            src={`/images/careers/icon-${benefit}.svg`}
                                            alt=""
                                            width={50}
                                            height={50}
                                        />
                                    </Box>
                                    <Typography variant="h6" gutterBottom>
                                        {t(`whyJoin.benefits.${benefit}.title`)}
                                    </Typography>
                                </Box>
                                <Typography variant="body1">
                                    {t(`whyJoin.benefits.${benefit}.description`)}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ mb: 8 }} />

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    {t('openPositions.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                    {t('openPositions.subtitle')}
                </Typography>

                <Grid container spacing={3}>
                    {jobListings.map((job) => (
                        <Grid size={12} key={job.id}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', md: 'row' },
                                    alignItems: { xs: 'flex-start', md: 'center' },
                                    justifyContent: 'space-between',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2
                                }}
                            >
                                <Box sx={{ mb: { xs: 3, md: 0 } }}>
                                    <Typography variant="h6" gutterBottom>
                                        {job.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        <Chip
                                            icon={<Work fontSize="small" />}
                                            label={job.department}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<LocationOn fontSize="small" />}
                                            label={job.location}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            icon={<AccessTime fontSize="small" />}
                                            label={job.type}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>

                                <Button
                                    variant="contained"
                                    component={Link}
                                    href={`/careers/${job.id}`}
                                >
                                    {t('openPositions.viewButton')}
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box sx={{ mb: 8 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 6 },
                        backgroundImage: 'linear-gradient(to right, #3a7bd5, #00d2ff)',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={12}>
                            <Typography variant="h4" gutterBottom>
                                {t('cta.title')}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {t('cta.description')}
                            </Typography>
                            <List>
                                {['culture', 'growth', 'impact'].map((item) => (
                                    <ListItem key={item} sx={{ px: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 36, color: 'white' }}>
                                            <Check />
                                        </ListItemIcon>
                                        <ListItemText primary={t(`cta.benefits.${item}`)} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    component={Link}
                                    href="/careers#openings"
                                    sx={{
                                        bgcolor: 'white',
                                        color: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        }
                                    }}
                                >
                                    {t('cta.button')}
                                </Button>
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <Box sx={{ position: 'relative', height: 250, width: '100%' }}>
                                <Image
                                    src="/images/careers/team-culture.jpg"
                                    alt=""
                                    fill
                                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                    {t('noOpeningsCta')}
                </Typography>
                <Button
                    component={Link}
                    href="/contact"
                    variant="text"
                    color="primary"
                    sx={{ mt: 1 }}
                >
                    {t('contactUs')}
                </Button>
            </Box>
        </Container>
    );
}