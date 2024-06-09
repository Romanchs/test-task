import {Box, Typography} from "@mui/material";


const TabContent = ({activeTab}) => {
  return (
    <Box sx={{ width: '100%', height: 'calc(100% - 50px)', p: 3, backgroundColor: '#F1F5F8' }}>
      <Box sx={{ width: '100%', height: '100%', p: 2, backgroundColor: 'white' }}>
        <Typography variant="h6">Content:</Typography>
        <Typography>{activeTab}</Typography>
      </Box>
    </Box>
  )
};

export default TabContent;