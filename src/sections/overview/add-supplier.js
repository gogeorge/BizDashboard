import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const AddSupplier = (props) => {
  const { difference, positive = false, sx, value, sCount, onClick } = props;

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
              {sCount} Suppliers
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <BuildingOffice2Icon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

AddSupplier.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};
