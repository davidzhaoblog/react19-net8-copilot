import { Metadata } from 'next';
import { Box, Container, Typography, Paper, Grid, Divider } from '@mui/material';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about' });

    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'about' });

    return (
        <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                    {t('title')}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    {t('subtitle')}
                </Typography>
            </Box>

            <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, mb: 6, bgcolor: 'background.paper' }}>
                <Grid container spacing={6} alignItems="center">
                    <Grid size={12}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {t('ourStory.title')}
                        </Typography>
                        <Typography paragraph>
                            {t('ourStory.paragraph1')}
                        </Typography>
                        <Typography paragraph>
                            {t('ourStory.paragraph2')}
                        </Typography>
                    </Grid>
                    <Grid size={12}>
                        <Box sx={{ position: 'relative', height: { xs: 300, md: 400 }, width: '100%' }}>
                            <Image
                                src="/images/about/our-story.jpg"
                                alt={t('ourStory.imageAlt')}
                                fill
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {t('ourValues.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                    {t('ourValues.subtitle')}
                </Typography>

                <Grid container spacing={4}>
                    {['innovation', 'quality', 'integrity', 'collaboration'].map((value) => (
                        <Grid size={12} key={value}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Box sx={{ width: 60, height: 60, mb: 2 }}>
                                    <Image
                                        src={`/images/about/icon-${value}.svg`}
                                        alt=""
                                        width={60}
                                        height={60}
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    {t(`ourValues.values.${value}.title`)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {t(`ourValues.values.${value}.description`)}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Divider sx={{ mb: 8 }} />

            <Box sx={{ mb: 8 }}>
                <Typography variant="h4" component="h2" gutterBottom align="center">
                    {t('timeline.title')}
                </Typography>

                <Box sx={{ mt: 6 }}>
                    {['founding', 'expansion', 'innovation', 'present'].map((milestone, index) => (
                        <Box
                            key={milestone}
                            sx={{
                                display: 'flex',
                                mb: 4,
                                flexDirection: index % 2 ? 'row-reverse' : 'row',
                                position: 'relative'
                            }}
                        >
                            <Box sx={{
                                width: '50%',
                                pr: index % 2 ? 0 : 4,
                                pl: index % 2 ? 4 : 0,
                                textAlign: index % 2 ? 'left' : 'right'
                            }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {t(`timeline.milestones.${milestone}.year`)}
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    {t(`timeline.milestones.${milestone}.title`)}
                                </Typography>
                                <Typography variant="body1">
                                    {t(`timeline.milestones.${milestone}.description`)}
                                </Typography>
                            </Box>
                            <Box sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                border: '4px solid',
                                borderColor: 'background.paper',
                                zIndex: 1
                            }} />
                            <Box sx={{
                                position: 'absolute',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: 2,
                                height: '100%',
                                bgcolor: 'divider',
                                zIndex: 0
                            }} />
                            <Box sx={{ width: '50%' }} />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}