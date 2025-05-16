'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, TextField, Button, Alert, CircularProgress, Divider } from '@mui/material';
import { Send, Phone, Email, LocationOn } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Metadata } from 'next';

// Note: Remove this import as it cannot be used in client components
// import { getTranslations } from 'next-intl/server';

// Define the form schema using Zod instead of Yup
const createContactFormSchema = (t: any) => z.object({
  name: z.string().min(1, t('form.validation.nameRequired')),
  email: z.string()
    .min(1, t('form.validation.emailRequired'))
    .email(t('form.validation.emailInvalid')),
  subject: z.string().min(1, t('form.validation.subjectRequired')),
  message: z.string()
    .min(1, t('form.validation.messageRequired'))
    .min(20, t('form.validation.messageMinLength', { count: 20 })),
});

// Derive TypeScript type from the Zod schema
// (must use the schema instance, not the factory function)
type ContactFormData = z.infer<ReturnType<typeof createContactFormSchema>>;

export default function ContactPage() {
  const t = useTranslations('contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  // Create the schema with translations
  const contactFormSchema = createContactFormSchema(t);

  // Initialize react-hook-form with Zod resolver
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitResult({});

    try {
      // Replace with actual API call
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(data),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful response
      setSubmitResult({
        success: true,
        message: t('form.successMessage'),
      });
      
      // Reset form on success
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitResult({
        success: false,
        message: t('form.errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <Grid container spacing={6}>
        {/* Fix Grid item props from size to xs */}
        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('infoSection.title')}
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              {t('infoSection.description')}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
              <LocationOn color="primary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {t('infoSection.address.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('infoSection.address.line1')}
                  <br />
                  {t('infoSection.address.line2')}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'flex-start' }}>
              <Email color="primary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {t('infoSection.email.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <a href="mailto:info@example.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {t('infoSection.email.value')}
                  </a>
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Phone color="primary" sx={{ mr: 2, mt: 0.5 }} />
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {t('infoSection.phone.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <a href="tel:+12345678900" style={{ color: 'inherit', textDecoration: 'none' }}>
                    {t('infoSection.phone.value')}
                  </a>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('form.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {t('form.description')}
            </Typography>

            {submitResult.message && (
              <Alert 
                severity={submitResult.success ? 'success' : 'error'} 
                sx={{ mb: 3 }}
              >
                {submitResult.message}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('form.fields.name')}
                        fullWidth
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('form.fields.email')}
                        fullWidth
                        variant="outlined"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="subject"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('form.fields.subject')}
                        fullWidth
                        variant="outlined"
                        error={!!errors.subject}
                        helperText={errors.subject?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('form.fields.message')}
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        error={!!errors.message}
                        helperText={errors.message?.message}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  >
                    {isSubmitting ? t('form.submitting') : t('form.submit')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom textAlign="center">
          {t('mapSection.title')}
        </Typography>
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: 450, borderRadius: 1, overflow: 'hidden' }}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6174715639835!2d-73.98823492422564!3d40.75784657138379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1695006247360!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Paper>
      </Box>
    </Container>
  );
}

// This metadata function will not work in a client component
// Move this to a separate page.tsx file without the 'use client' directive
// export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
//   const t = await getTranslations({ locale, namespace: 'contact' });
  
//   return {
//     title: t('metaTitle'),
//     description: t('metaDescription'),
//   };
// }