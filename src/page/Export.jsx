import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { JSONEditor } from 'vanilla-jsoneditor'
import { useEffect, useRef } from "react";
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { createAjvValidator } from 'vanilla-jsoneditor';

function saveConfigToScript (notification) {
    var saveMessage = new CustomEvent('saveConfig', {
        detail: {
            searchData: window.searchData, 
            notification: !!notification
        }
    });
    document.dispatchEvent(saveMessage);
}

const presetCssList = [
`     .search-jumper-searchBarCon {
     }
     .search-jumper-searchBar {
         background: #505050;
         border-radius: 20px!important;
         border: 1px solid #b3b3b3;
         opacity: 0.3;
     }
     .search-jumper-btn {
     }
     .search-jumper-btn>i {
     }
     .search-jumper-logoBtnSvg {
     }
     .search-jumper-type {
         background: #c5c5c5;
         border-radius: 20px!important;
     }
     .search-jumper-word {
         background: black;
         color: white!important;
     }
     .search-jumper-tips {
         font-size: xx-large;
         background: #f5f5f5e0;
         border-radius: 10px!important;
         box-shadow: 0px 0px 10px 0px #000;
         color: black;
     }
     .search-jumper-searchBar .search-jumper-btn:hover {
         color: white;
     }`,
`     .search-jumper-searchBarCon {
     }
     .search-jumper-searchBar {
         background: rgb(153 153 153 / 50%);
         border-radius: 20px!important;
         border: 1px solid #c9c9c9;
         opacity: 0.3;
     }
     .search-jumper-btn {
     }
     .search-jumper-type {
         background: rgb(255 255 255 / 38%);
     }
     .search-jumper-word,a.search-jumper-word {
         background: rgb(255 255 255 / 70%);
         color: #282828!important;
     }
     .search-jumper-tips {
         background: #0A0A0Ae0;
         border-radius: 10px!important;
         box-shadow: 0px 0px 10px 0px #FFFFFF;
         font-weight: bold;
         color: white;
     }
     .search-jumper-searchBar .search-jumper-btn:hover {
         color: black;
     }
     .search-jumper-searchBar .search-jumper-btn.search-jumper-word:hover{
         background:white;
     }`
];

function UploadSpeedDialAction(props) {
    return (
        <React.Fragment>
            <input
                accept=".txt, .json"
                style={{ display: "none" }}
                id="icon-button-file"
                type="file"
                onChange={props.onChange}
            />
            <label htmlFor="icon-button-file">
                <SpeedDialAction
                    component="span"
                    {...props}
                ></SpeedDialAction>
            </label>
        </React.Fragment>
    );
}

const schema = {
    title: 'Types List',
    description: 'List of the data of types',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            type: {
                title: 'Type Name',
                description: 'The name of type.',
                examples: ['Search'],
                type: 'string'
            },
            icon: {
                title: 'Type icon',
                description: 'The icon of type.',
                examples: ['image'],
                type: 'string'
            },
            sites: {
                title: 'Sites List',
                description: 'List of the data of sites',
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            title: 'Site Name',
                            description: 'The name of site.',
                            examples: ['Google'],
                            type: 'string'
                        },
                        url: {
                            title: 'Site Url',
                            description: 'The url of site.',
                            examples: ['https://www.google.com/search?q=%s'],
                            type: 'string'
                        }
                    },
                    required: ['name', 'url']
                }
            }
        },
        required: ['type', 'sites']
    }
}
var editor;

function SvelteJSONEditor(props) {
    const refContainer = useRef(null);
    const refEditor = useRef(null);

    useEffect(() => {
        refEditor.current = new JSONEditor({
            target: refContainer.current,
            props: {}
        });
        editor = refEditor.current;

        return () => {
            if (refEditor.current) {
                refEditor.current.destroy();
                refEditor.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (refEditor.current) {
            refEditor.current.updateProps(props);
        }
    }, [props]);

    return <div className="svelte-jsoneditor-react jse-theme-dark" ref={refContainer}></div>;
}

function UploadBookmarkAction(props) {
    return (
        <React.Fragment>
            <input
                accept=".html"
                style={{ display: "none" }}
                id="icon-bookmark-file"
                type="file"
                onChange={props.onChange}
            />
            <label htmlFor="icon-bookmark-file">
                <SpeedDialAction
                    component="span"
                    {...props}
                ></SpeedDialAction>
            </label>
        </React.Fragment>
    );
}

function DefaultOpenSpeedDial(props) {
    const [isOpen, setIsOpen] = React.useState(true);
    return (
        <SpeedDial
            open={isOpen}
            onClick={e => {
                if (e.target.classList.contains("MuiSpeedDialIcon-icon") || e.target.classList.contains("MuiFab-primary") || e.target.parentNode.classList.contains("MuiSpeedDialIcon-icon")) {
                    setIsOpen(!isOpen);
                }
            }}
            {...props}
        />
    );
}

export default function Export() {
    const [presetCss, setPresetCss] = React.useState('');
    const [cssText, setCssText] = React.useState(window.searchData.prefConfig.cssText||'');
    const [fontAwesomeCss, setFontAwesomeCss] = React.useState(window.searchData.prefConfig.fontAwesomeCss);

    var downloadEle = document.createElement('a');
    downloadEle.download = "searchJumper.json";
    downloadEle.target = "_blank";
    function saveConfig() {
        try {
            if (editor) {
                if (editor.get().json) {
                    window.searchData.sitesConfig = editor.get().json;
                } else if (editor.get().text) {
                    window.searchData.sitesConfig = JSON.parse(editor.get().text);
                }
            }
            window.searchData.prefConfig.cssText = cssText;
            window.searchData.prefConfig.fontAwesomeCss = fontAwesomeCss;
            saveConfigToScript(true);
        } catch (e) {
            alert(e);
        }
    }

    function copyConfig() {
        var copyMessage = new Event('copyConfig');
        document.dispatchEvent(copyMessage);
    }

    function importConfig(event) {
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = function() {
            editor.set({json:JSON.parse(this.result)})
            saveConfig();
        };
    }

    function importBookmarks(event) {
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = function() {
            var doc = null;
            try {
                doc = document.implementation.createHTMLDocument('');
                doc.documentElement.innerHTML = this.result;
            }
            catch (e) {
                console.log('parse error');
            }
            let curSites = [];
            let bookmarks = [];
            [].forEach.call(doc.querySelectorAll("a"), item => {
                for(let i = 0; i < bookmarks.length; i++) {
                    if (item.href === bookmarks[i].url) return;
                }
                let site = {name: item.innerText || ("bookmark_" + bookmarks.length), url: item.href};
                let icon = item.getAttribute("ICON");
                if (icon) site.icon = icon;
                curSites.push(site);
                if (curSites.length === 1) {
                    bookmarks.push(curSites);
                } else if (curSites.length >= 200) {
                    curSites = [];
                }
            });
            if (!bookmarks || bookmarks.length <= 0) return;
            let typeName = "BM", index = 0;
            let createNewType = typeSites => {
                let hasType = true;
                while (hasType) {
                    hasType = false;
                    for (let j = 0; j < window.searchData.sitesConfig.length; j++) {
                        if (window.searchData.sitesConfig[j].type === typeName) {
                            typeName = "BM_" + (++index);
                            hasType = true;
                            break;
                        }
                    }
                }
                let newType = {type: typeName, description:'Bookmarks', icon: "bookmark", sites: typeSites, match: "0"}
                window.searchData.sitesConfig.push(newType);
            }
            bookmarks.forEach(typeSites => createNewType(typeSites));
            editor.set({json:window.searchData.sitesConfig})
            saveConfigToScript(true);
        };
    }

    function exportConfig() {
        let blobStr = [(JSON.stringify(editor.get().json || window.searchData.sitesConfig, null, 4))];
        let myBlob = new Blob(blobStr, { type: "application/json" });
        downloadEle.href = window.URL.createObjectURL(myBlob);
        downloadEle.click();
    }

    const handleChange = (event: SelectChangeEvent) => {
        setPresetCss(event.target.value);
        if (!cssText || window.confirm(window.i18n('replaceCss'))) {
            if (event.target.value === '') setCssText('');
            else setCssText(presetCssList[event.target.value]);
        }
    };
    return (
        <Box sx={{pb : 5}}>
            <Paper elevation={5} sx={{textAlign:'center', borderRadius:'10px'}}>
                <h2 style={{padding:'5px'}}>{window.i18n('exportConfig')}</h2>
            </Paper>
            <Box sx={{ maxHeight: '80vh',overflow: 'auto'}}>
                <SvelteJSONEditor
                    content={{json:window.searchData.sitesConfig}}
                    validator={createAjvValidator(schema)}
                />
            </Box>
            <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>{window.i18n('presetCss')}</InputLabel>
                <Select
                    value={presetCss}
                    label={window.i18n('presetCss')}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={0}>Default</MenuItem>
                    <MenuItem value={1}>Light</MenuItem>
                </Select>
                <FormHelperText>{window.i18n('presetCssTips')}</FormHelperText>
            </FormControl>
            <TextField
                id="styleText"
                label={window.i18n('customCss')}
                multiline
                fullWidth
                sx={{mb : 1}}
                rows={10}
                value={cssText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setCssText(event.target.value);
                }}
            />
            <TextField
                id="fontAwesomeCss"
                label={window.i18n('fontAwesomeCss')}
                fullWidth
                sx={{mb : 1}}
                value={fontAwesomeCss}
                placeholder="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.1.1/css/all.min.css"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFontAwesomeCss(event.target.value);
                }}
            />
            <DefaultOpenSpeedDial
                ariaLabel="SpeedDial"
                sx={{ position: 'fixed', bottom: '20%', right: 16 }}
                icon={<SpeedDialIcon />}
            >
                <SpeedDialAction
                    key='Save'
                    icon=<SaveIcon />
                    tooltipTitle={window.i18n('save')}
                    onClick = {saveConfig}
                />
                <SpeedDialAction
                    key='Copy'
                    icon=<FileCopyIcon />
                    tooltipTitle={window.i18n('copy')}
                    onClick = {copyConfig}
                />
                <SpeedDialAction
                    key='Export'
                    icon=<FileDownloadIcon />
                    tooltipTitle={window.i18n('export')}
                    onClick = {exportConfig}
                />
                <UploadSpeedDialAction
                    key='Import'
                    icon=<FileUploadIcon />
                    tooltipTitle={window.i18n('import')}
                    onChange = {importConfig}
                />
                <UploadBookmarkAction
                    key='Bookmarks'
                    icon=<BookmarksIcon />
                    tooltipTitle={window.i18n('importBookmarks')}
                    onChange = {importBookmarks}
                />
            </DefaultOpenSpeedDial>
        </Box>
    );
}