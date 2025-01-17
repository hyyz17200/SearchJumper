import logo from './logo.svg';
// import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Divider from '@mui/material/Divider';
import React from 'react';
import General from './page/General.jsx';
import Engines from './page/Engines.jsx';
import About from './page/About.jsx';
import Export from './page/Export.jsx';
import FindInPage from './page/FindInPage.jsx';
import Link from '@mui/material/Link';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{width: '100%'}}
      {...other}
    >
      {value === index && (
        <Container>
          {children}
        </Container>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function App() {
  const [value, setValue] = React.useState(0);
  const [inited, setInited] = React.useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    if (window.isListen) return;
    window.isListen = true;
    window.addEventListener('message',function(e){
      if (e.data.command === 'loadConfig') {
        window.searchData = e.data.searchData;
        var receivedMessage = new Event('received');
        document.dispatchEvent(receivedMessage);
        setInited(true);
      }
    }, true);
  }, [])

  return (
    <Box
      inited={inited}
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100vh', marginLeft: '200px' }}
    >
      <List
        id="tabs"
        component={Paper}
        elevation={5}
        sx={{
          width: '200px',
          height: '100%',
          left: 0,
          maxWidth: 200,
          position: 'fixed'
        }}
      >
        <ListItem
          onClick={() => {
            document.querySelector('#tabs').classList.remove('hide');
          }}
        >
          <ListItemAvatar>
            <Link href='https://github.com/hoothin/SearchJumper' target="_blank">
              <Avatar alt="SearchJumper" component={Paper} elevation={5} src={logo}/>
            </Link>
          </ListItemAvatar>
          <ListItemText primary={window.i18n('name')} secondary="Ver 0.91" />
        </ListItem>
        <Divider component="li" variant="inset" sx={{marginRight: 3}}/>
        <ListItem sx={{flexFlow: 'column'}}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            scrollButtons="auto"
            value={value}
            onChange={handleChange}
            onClick={()=>{document.querySelector('#tabs').classList.add('hide')}}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: 'divider', width: '100%' }}
          >
            <Tab label={window.i18n('general')} {...a11yProps(0)} />
            <Tab label={window.i18n('searchEngines')} {...a11yProps(1)} />
            <Tab label={window.i18n('exportConfig')} {...a11yProps(2)} />
            <Tab label={window.i18n('findInPage')} {...a11yProps(3)} />
            <Tab label={window.i18n('about')} {...a11yProps(4)} />
          </Tabs>
        </ListItem>
      </List>
      <TabPanel value={value} index={0} sx={{width:1}}>
        {window.searchData ? <General/> : <About/>}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {window.searchData ? <Engines/> : <About/>}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {window.searchData ? <Export/> : <About/>}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {window.searchData ? <FindInPage/> : <About/>}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <About/>
      </TabPanel>
    </Box>
  );
}
