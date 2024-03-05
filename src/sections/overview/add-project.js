import PropTypes from 'prop-types';
import DocumentChartBarIcon from '@heroicons/react/24/solid/DocumentChartBarIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const AddProject = (props) => {
  const { value, sx, onClick, pCount } = props;

  return (
    <Card 
      sx={sx}
      onClick={onClick}
    >
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {pCount} Projects
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <DocumentChartBarIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

AddProject.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
