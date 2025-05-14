// src/components/MuiWithTailwind.tsx
// 'use client';

import { Button, Card, CardContent, Typography } from '@mui/material';

export default function MuiWithTailwind() {
  return (
    <div className="flex flex-col items-center p-4">
      <Card className="max-w-md mb-4 shadow-lg hover:shadow-xl transition-shadow">
        <CardContent>
          <Typography variant="h5" component="div" className="mb-2 text-blue-600">
            MUI + Tailwind CSS
          </Typography>
          <Typography variant="body1" className="text-gray-700">
            This card uses MUI components styled with Tailwind classes.
          </Typography>
          <div className="mt-4 flex gap-2">
            <Button variant="contained" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
              MUI Button
            </Button>
            <button className="px-4 py-2 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors">
              Tailwind Button
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}