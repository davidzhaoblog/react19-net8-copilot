import { Metadata } from 'next';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Divider } from '@mui/material';
import { LinkedIn, Twitter, Email } from '@mui/icons-material';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'team' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

// Mock team data - in a real app, this would come from an API or CMS
const executiveTeam = [
  {
    id: 'john-doe',
    name: 'John Doe',
    title: 'Chief Executive Officer',
    bio: 'John has over 20 years of experience in the tech industry and has led multiple companies to successful exits.',
    image: '/images/team/ceo.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'john@example.com',
  },
  {
    id: 'jane-smith',
    name: 'Jane Smith',
    title: 'Chief Technology Officer',
    bio: 'Jane has a background in AI and machine learning, with previous experience at Google and Amazon.',
    image: '/images/team/cto.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'jane@example.com',
  },
  {
    id: 'michael-brown',
    name: 'Michael Brown',
    title: 'Chief Financial Officer',
    bio: 'Michael has a strong background in finance and has helped scale multiple startups to unicorn status.',
    image: '/images/team/cfo.jpg',
    linkedin: 'https://linkedin.com',
    email: 'michael@example.com',
  },
];

const departmentHeads = [
  {
    id: 'emily-wilson',
    name: 'Emily Wilson',
    title: 'VP of Engineering',
    bio: 'Emily leads our engineering team with expertise in scalable systems and cloud architecture.',
    image: '/images/team/vp-eng.jpg',
    linkedin: 'https://linkedin.com',
    email: 'emily@example.com',
  },
  {
    id: 'david-lee',
    name: 'David Lee',
    title: 'VP of Product',
    bio: 'David has a passion for user-centered design and has previously led product teams at Microsoft.',
    image: '/images/team/vp-product.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'david@example.com',
  },
  {
    id: 'sarah-johnson',
    name: 'Sarah Johnson',
    title: 'VP of Marketing',
    bio: 'Sarah has led marketing at several B2B SaaS companies with a focus on growth and brand strategy.',
    image: '/images/team/vp-marketing.jpg',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    email: 'sarah@example.com',
  },
  {
    id: 'robert-chen',
    name: 'Robert Chen',
    title: 'VP of Sales',
    bio: 'Robert brings 15 years of enterprise sales experience and has built high-performing teams at multiple companies.',
    image: '/images/team/vp-sales.jpg',
    linkedin: 'https://linkedin.com',
    email: 'robert@example.com',
  },
];

export default async function TeamPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'team' });

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
          src="/images/team/team-photo.jpg"
          alt={t('teamPhotoAlt')}
          fill
          priority
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      </Box>

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          {t('leadership.title')}
        </Typography>

        <Grid container spacing={4}>
          {executiveTeam.map((member) => (
            <Grid size={12} key={member.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{ 
                    position: 'relative',
                    height: 300
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {member.linkedin && (
                    <Button 
                      size="small" 
                      startIcon={<LinkedIn />}
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener"
                    >
                      LinkedIn
                    </Button>
                  )}
                  {member.twitter && (
                    <Button 
                      size="small" 
                      startIcon={<Twitter />}
                      href={member.twitter}
                      target="_blank"
                      rel="noopener"
                    >
                      Twitter
                    </Button>
                  )}
                  {member.email && (
                    <Button 
                      size="small" 
                      startIcon={<Email />}
                      href={`mailto:${member.email}`}
                    >
                      Email
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ mb: 8 }} />

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 4 }}>
          {t('departments.title')}
        </Typography>

        <Grid container spacing={4}>
          {departmentHeads.map((member) => (
            <Grid size={12} key={member.id}>
              <Card 
                elevation={0} 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="div"
                  sx={{ 
                    position: 'relative',
                    height: 250
                  }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </CardMedia>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    {member.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {member.linkedin && (
                    <Button 
                      size="small" 
                      startIcon={<LinkedIn />}
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener"
                    >
                      LinkedIn
                    </Button>
                  )}
                  {member.twitter && (
                    <Button 
                      size="small" 
                      startIcon={<Twitter />}
                      href={member.twitter}
                      target="_blank"
                      rel="noopener"
                    >
                      Twitter
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 8, p: 6, bgcolor: 'background.default', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          {t('joinUs.title')}
        </Typography>
        <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
          {t('joinUs.description')}
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          href="/careers"
          sx={{ mt: 2 }}
        >
          {t('joinUs.button')}
        </Button>
      </Box>

      <Divider sx={{ mb: 8 }} />

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('contact.title')}
        </Typography>
        <Typography variant="body1" paragraph>
          {t('contact.description')}
        </Typography>
        <Button 
          variant="outlined" 
          size="large" 
          href="/contact"
        >
          {t('contact.button')}
        </Button>
      </Box>
    </Container>
  );
}