import {useState, useEffect, useRef, useCallback} from 'react';
import {Tabs, Tab, IconButton, Menu, MenuItem, Box, SvgIcon, Divider, Popover} from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { tabsClasses } from '@mui/material/Tabs';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import GridViewIcon from '@mui/icons-material/GridView';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import WifiCalling3OutlinedIcon from '@mui/icons-material/WifiCalling3Outlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PieChartOutlineIcon from '@mui/icons-material/PieChartOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import TabContent from "./TabContent.jsx";
import isDblTouchTap from "../common/isDblTouchTap.js";

const iconsObj = {
  Inventory2OutlinedIcon,
  GridViewIcon,
  AccountBalanceOutlinedIcon,
  WifiCalling3OutlinedIcon,
  PersonAddAltOutlinedIcon,
  StorefrontOutlinedIcon,
  PieChartOutlineIcon,
  MailOutlineIcon,
  SettingsOutlinedIcon,
  AutoStoriesOutlinedIcon,
  ViewInArOutlinedIcon,
  FormatListBulletedOutlinedIcon,
  ShoppingCartCheckoutOutlinedIcon
};
const getLocalTabs = JSON.parse(localStorage.getItem('tabs'));
const initialState = [
  { id: 1, label: 'Lagerverwaltung', icon: 'Inventory2OutlinedIcon', content: 'Lagerverwaltung', pinned: true },
  { id: 2, label: 'Dashboard', icon: 'GridViewIcon', content: 'Dashboard', pinned: false },
  { id: 3, label: 'Banking', icon: 'AccountBalanceOutlinedIcon', content: 'Banking', pinned: false },
  { id: 4, label: 'Telefonie', icon: 'WifiCalling3OutlinedIcon', content: 'Telefonie', pinned: false },
  { id: 5, label: 'Accounting', icon: 'PersonAddAltOutlinedIcon', content: 'Accounting', pinned: false },
  { id: 7, label: 'Verkauf', icon: 'StorefrontOutlinedIcon', content: 'Verkauf', pinned: false },
  { id: 8, label: 'Post Office', icon: 'PieChartOutlineIcon', content: 'Post Office', pinned: false },
  { id: 9, label: 'Administration', icon: 'MailOutlineIcon', content: 'Administration', pinned: false },
  { id: 10, label: 'Help', icon: 'SettingsOutlinedIcon', content: 'Help', pinned: false },
  { id: 11, label: 'Warenbestand', icon: 'AutoStoriesOutlinedIcon', content: 'Warenbestand', pinned: false },
  { id: 12, label: 'Auswahllisten', icon: 'ViewInArOutlinedIcon', content: 'Auswahllisten', pinned: false },
  { id: 13, label: 'Einkauf', icon: 'FormatListBulletedOutlinedIcon', content: 'Einkauf', pinned: false },
  { id: 14, label: 'Rechn', icon: 'ShoppingCartCheckoutOutlinedIcon', content: 'Rechn', pinned: false },
];

const DraggableTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(getLocalTabs ?? initialState);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElPopover, setAnchorElPopover] = useState(null);
  const [dropdownTabs, setDropdownTabs] = useState([]);
  const containerRef = useRef(null);
  const [showShadow, setShowShadow] = useState(false);
  const [mouseOverTab, setMouseOverTab] = useState(0);

  const handleRightClick = (e, id) => {
    e.preventDefault();
    setTabs((tabs) =>
      tabs.map((tab) => (tab.id === id ? { ...tab, pinned: !tab.pinned } : tab))
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const isSourcePinned = tabs[sourceIndex].pinned;
    const isDestinationPinned = tabs[destinationIndex]?.pinned;

    if (isSourcePinned !== isDestinationPinned) return;

    const newTabs = Array.from(tabs);
    const [removed] = newTabs.splice(sourceIndex, 1);
    newTabs.splice(destinationIndex, 0, removed);
    setTabs(newTabs);

    if (activeTab === sourceIndex) {
      setActiveTab(destinationIndex);
    } else if (sourceIndex < activeTab && destinationIndex >= activeTab) {
      setActiveTab(activeTab - 1);
    } else if (sourceIndex > activeTab && destinationIndex <= activeTab) {
      setActiveTab(activeTab + 1);
    }
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const updateDropdownTabs = () => {
    if (!containerRef.current) return;

    if(dropdownTabs.length === 0) {
      setAnchorEl(null);
    }

    const containerWidth = containerRef.current.offsetWidth;
    const tabWidthPinned = 60;
    const tabWidthUnPinned = 125;
    const pinnedTabs = tabs.filter(tab => tab.pinned);
    const unpinnedTabs = tabs.filter(tab => !tab.pinned);

    let totalWidth = pinnedTabs.length * tabWidthPinned;
    const visibleTabs = [...pinnedTabs];
    const hiddenTabs = [];

    unpinnedTabs.forEach(tab => {
      if (totalWidth + tabWidthUnPinned <= containerWidth) {
        visibleTabs.push(tab);
        totalWidth += tabWidthUnPinned;
      } else {
        hiddenTabs.push(tab);
      }
    });

    setDropdownTabs(hiddenTabs);

    const activeTabIndex = tabs.findIndex(tab => tab.id === tabs[activeTab]?.id);
    if (hiddenTabs.includes(tabs[activeTabIndex])) {
      const visibleTab = visibleTabs.find(tab => tab.id === tabs[activeTab].id);
      if (visibleTab) {
        setActiveTab(tabs.findIndex(tab => tab.id === visibleTab.id));
      }
    }

    setShowShadow(pinnedTabs.length * tabWidthPinned > containerWidth);
  };

  const handlePopoverOpen = (event, index, pinned) => {
    if(pinned) {
      setMouseOverTab(index);
      setAnchorElPopover(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorElPopover(null);
  };

  const handleClose = useCallback((event, id) => {
      event.stopPropagation();

      const tabToDeleteIndex = tabs.findIndex(
        tab => tab.id === id
      );
      const updatedTabs = tabs.filter((tab, index) => {
        return index !== tabToDeleteIndex;
      });

      setTabs(updatedTabs);
      setActiveTab(0);
    },
    [tabs]
  );

  useEffect(() => {
    window.addEventListener('resize', updateDropdownTabs);
    updateDropdownTabs();

    localStorage.setItem('tabs', JSON.stringify(tabs));
    return () => {
      window.removeEventListener('resize', updateDropdownTabs);
    };
  }, [tabs]);

  return (
    <Box sx={{width: '100%', height: '100dvh', overflowY: 'hidden', pt: 6}}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="horizontal">
          {(provided) => (
            <Box
              ref={(ref) => {
                provided.innerRef(ref);
                containerRef.current = ref;
              }}
              {...provided.droppableProps}
              sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <Tabs
                value={dropdownTabs.includes(tabs[activeTab]) ? false : activeTab}
                variant="scrollable"
                scrollButtons
                allowScrollButtonsMobile
                sx={{ flexGrow: 1,
                  '.MuiTabs-indicator': {
                    top: 0,
                  },
                  "& .MuiTabScrollButton-root": {
                    '& .MuiSvgIcon-root': {
                      display: 'none',
                    },
                    width: '20px',
                  },
                  "& .MuiTabScrollButton-root:first-of-type::before": {
                    content: '""',
                    width: '100%',
                    height: '100%',
                    background: `${showShadow && 'linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0))'}`
                  },
                  "& .MuiTabScrollButton-root:last-of-type::after": {
                    content: '""',
                    width: '100%',
                    height: '100%',
                    background: `${showShadow && 'linear-gradient(to left, rgba(0,0,0,0.2), rgba(0,0,0,0))'}`
                  },
                  [`& .${tabsClasses.scrollButtons}`]: {
                    '&.Mui-disabled': { opacity: 0 },
                  },
                }}
              >
                {tabs
                  .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
                  .map(({ id, label, icon, pinned }, index) => (
                    pinned || !dropdownTabs.find(tab => tab.id === id) ? (
                      <Draggable
                        key={id}
                        draggableId={`id-${id}`}
                        index={index}
                        disableInteractiveElementBlocking={true}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? '#7F858D' : pinned ? 'lightgray' : activeTab === index ? '#F1F5F8' : 'white',
                              cursor: snapshot.isDragging ? 'pointer' : 'pointer',
                            }}
                          >
                            <Tab
                              icon={icon ? <SvgIcon component={iconsObj[icon]} inheritViewBox sx={{height: '16px'}} /> : null}
                              iconPosition="start"
                              label={
                                !pinned && label
                                  ?
                                  (<Box display={'flex'} alignItems={'center'} gap={2}> {label}
                                    { activeTab === index && tabs.length !== 1 && (
                                      <IconButton
                                        sx={{height: '10px', width: '10px'}}
                                        component="div"
                                        onClick={event => handleClose(event, id)}
                                      >
                                        <SvgIcon component={CancelRoundedIcon} inheritViewBox sx={{height: '15px', '&:hover': {color: '#EE3F3E'}}} />
                                      </IconButton>
                                    )}
                                    </Box>)
                                  : null
                              }
                              onClick={() => handleTabClick(index)}
                              onTouchStart={(e) => {
                                if (isDblTouchTap(e)) {
                                  handleRightClick(e, id);
                                }
                              }}
                              onContextMenu={(e) => handleRightClick(e, id)}
                              aria-owns={anchorElPopover ? 'mouse-over-popover' : undefined}
                              aria-haspopup="true"
                              onMouseEnter={(e) => handlePopoverOpen(e, index, pinned)}
                              onMouseLeave={handlePopoverClose}
                              sx={{
                                textTransform: 'capitalize',
                                width: 'min-content',
                                minWidth: 'auto',
                                height: '48px',
                                minHeight: '48px',
                                backgroundColor: pinned ? 'lightgray' : activeTab === index ? '#F1F5F8' : 'white',
                                cursor: pinned ? 'default' : 'pointer',
                                position: 'relative',
                                '& :after': {
                                  content: '""',
                                  height: '30%',
                                  width: '1px',
                                  position: 'absolute',
                                  right: 0,
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  backgroundColor: '#EEEFF4',
                                }
                              }}
                            />
                          </Box>
                        )}
                      </Draggable>
                    ) : null
                  ))}
                <Popover
                  sx={{
                    mt: 1,
                    pointerEvents: 'none'
                  }}
                  open={Boolean(anchorElPopover)}
                  anchorEl={anchorElPopover}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  onClose={handlePopoverClose}
                  disableRestoreFocus
                >
                  <Box display={'flex'} alignItems={'center'} p={1}>
                    <SvgIcon component={iconsObj[tabs[mouseOverTab].icon]} inheritViewBox sx={{height: '16px'}} />
                    {tabs[mouseOverTab].label}
                  </Box>
                </Popover>
                {provided.placeholder}
              </Tabs>
              {!!dropdownTabs.length &&
                <>
                  <IconButton onClick={handleMenuClick} sx={{height: '47px', borderRadius: 0, backgroundColor: anchorEl ? '#4690E2' : 'white', '&:hover': {color: 'white', backgroundColor: '#3a7ac2'}}}>
                    {anchorEl
                      ? <KeyboardArrowUpIcon sx={{height: '16px', color: 'white'}} />
                      : <KeyboardArrowDownIcon sx={{height: '16px'}} />
                    }
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{sx: {width: '185px'}}}
                  >
                    {dropdownTabs.map((tab, index) => (
                      <Box key={tab.id}>
                        <MenuItem
                          onClick={() => {
                            handleTabClick(tabs.findIndex(t => t.id === tab.id));
                            handleMenuClose();
                          }}
                          onContextMenu={(e) => handleRightClick(e, tab.id)}
                          onTouchStart={(e) => {
                            if (isDblTouchTap(e)) {
                              handleRightClick(e, tab.id);
                            }
                          }}
                          sx={{display: 'flex', justifyContent: 'space-between', backgroundColor: tabs?.[activeTab]?.id === tab?.id ? '#F1F5F8' : 'white'}}
                        >
                          <Box display={'flex'} alignItems={'center'}>
                            <SvgIcon component={iconsObj[tab.icon]} inheritViewBox sx={{height: '16px'}} />
                            {tab.label}
                          </Box>
                          <IconButton
                            sx={{height: '10px', width: '10px'}}
                            component="div"
                            onClick={event => handleClose(event, tab.id)}
                          >
                            <SvgIcon component={CancelRoundedIcon} inheritViewBox sx={{height: '15px', color: '#b5bdc7', '&:hover': {color: '#EE3F3E'}}} />
                          </IconButton>
                        </MenuItem>
                        {index !== dropdownTabs?.length -1 &&
                          <Divider sx={{mt: '0px!important', mb: '0px!important'}} orientation="horizontal" variant="middle" />
                        }
                      </Box>
                    ))}
                  </Menu>
                </>
              }
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <TabContent activeTab={tabs[activeTab]?.content}/>
    </Box>
  );
};

export default DraggableTabs;