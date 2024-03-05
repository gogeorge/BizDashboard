import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  FormControl,
  CardContent,
  CardHeader,
  Divider,
  Select,
  Box,
  Grid,
  MenuItem,
  Typography,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRef } from 'react';
import jsPDF from 'jspdf';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ReportTemplate from './report-template';

dayjs.locale('en-gb');

export const ReportGen = (data) => {
    const [clientList, setClientList] = useState([])
    const [clientNames, setClientNames] = useState([])
    const [supplierList, setSupplierList] = useState([]);

    const [selectedClient, setSelectedClient] = useState('')
    const [selectedFromCliDate,setSelectedFromCliDate] = useState(dayjs())
    const [selectedToCliDate,setSelectedToCliDate] = useState(dayjs())
    const [selectedCliFilter, setSelectedCliFilter] = useState('')

    const [selectedSupplier, setSelectedSupplier] = useState('')
    const [selectedFromDate, setSelectedFromDate] = useState(dayjs())
    const [selectedToDate, setSelectedToDate] = useState(dayjs())
    const [selectedFilter, setSelectedFilter] = useState('')

    const [finalSupplierInfo, setSupplierInfo] = useState({})
    const [finalClientInfo, setClientInfo] = useState({})
    const [finalProjectList, setProjectList] = useState([])
    const [supplierReport, setSupplierReport] = useState(false)
    const [clientReport, setClientReport] = useState(false)


    const reportTemplateRef = useRef(null);


    useEffect(() => {

        const projects = data.data.folders[0].folders
        const clients = data.data.folders[1].folders
        const suppliers = data.data.folders[2].folders
        
        const folderClients = []
        const countries = []
        const people = []
        const info = []

        for (let i = 0; i < clients.length; i++) {
          countries.push(clients[i].name)
          for (let j = 0; j < clients[i].folders.length; j++) {
            folderClients.push(clients[i].folders[j]);
            if (clients[i].folders[j].contacts !== undefined) {
              for (let k = 0; k < clients[i].folders[j].contacts.length; k++) {
                let cinfo = clients[i].folders[j].contacts[k]
                if (cinfo.name !== '') {
                  people.push(cinfo.name)
                  info.push(cinfo)
                }
              }
            }
          }
        }
          
        const folderSuppliers = [];
    
        for (let i = 0; i < suppliers.length; i++) {
          folderSuppliers.push(suppliers[i].name);
          if (suppliers[i].contacts !== undefined) {
            for (let j = 0; j < suppliers[i].contacts.length; j++) {
              let cinfo = suppliers[i].contacts[j]
              if (cinfo.name !== '') {
                people.push(cinfo.name)
                info.push(cinfo)
              }
            }
          }
        }

        for (let i = 0; i < projects.length; i++) {
          if (projects[i].contacts !== undefined) {
            for (let j = 0; j < projects[i].contacts.length; j++) {
              let cinfo = projects[i].contacts[j]
              if (cinfo.name !== '') {
                people.push(cinfo.name)
                info.push(cinfo)
              }
            }
          }
        }
      
        const cNames = folderClients.map((client) => client.name);
        setClientNames(cNames.sort())
        setClientList(folderClients)
        setSupplierList(folderSuppliers.sort())
        // setCountryList(countries.sort())
        // setContactList(people)
        // setContactInfo(info)
    }, [])

    const generateClientReport = () => {
        console.log(selectedFromDate.format('YYYY-MM-DD'), selectedToDate.format('YYYY-MM-DD'))

        const dateFrom = selectedFromCliDate.format('YYYY-MM-DD')
        const dateTo = selectedToCliDate.format('YYYY-MM-DD')

        // const clients = data.data.folders[3].folders
        const projects = data.data.folders[0].folders

        let clientInfo = {}
        let projectList = []
        if (selectedClient == '') {
            console.log('non client pass')
            clientInfo = clientList[0]
            console.log(clientInfo)
            for (let j = 0; j < projects.length; j++) {
                projectList.push(projects[j]) 
            }
        } else {
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i].name == selectedClient) {
                    console.log(clientList, selectedClient)
                    clientInfo = clientList[i]
                    for (let j = 0; j < projects.length; j++) {
                        if (projects[j].client.includes(selectedClient)) {
                            projectList.push(projects[j]) 
                        }
                    }
                    break
                }
            }
        }


        const dateFilter = (val) => {
            if (dateFrom == dateTo) {
                return true
            } else {
                return dayjs(val, 'DD/MM/YYYY').isAfter(dateFrom) && dayjs(val, 'DD/MM/YYYY').isBefore(dateTo)
            }
        }
        if (selectedCliFilter == 'COMP') {
            const filter = projectList.filter(proj => proj.status === 'COMP' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'QUO') {
            const filter = projectList.filter(proj => proj.status === 'QUO' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            console.log('pl', projectList)
            console.log('cli', clientInfo)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'OC') {
            const filter = projectList.filter(proj => proj.status === 'OC' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'OCS') {
            const filter = projectList.filter(proj => proj.status === 'OCS' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'CLS') {
            const filter = projectList.filter(proj => proj.status === 'CLS' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'High Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'HIGH' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'Medium Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'MEDIUM' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'Low Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'LOW' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == 'None') {
            const filter = projectList.filter(proj => dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedCliFilter == '') {
            setProjectList(projectList)
        }
        setClientInfo(clientInfo)
        setClientReport(true)
        setSupplierReport(false)
        // setSupplierMetadata()
        handleGeneratePdf()
    }

    const generateSupplierReport = () => {
        console.log(selectedFromDate.format('YYYY-MM-DD'), selectedToDate.format('YYYY-MM-DD'))

        const dateFrom = selectedFromDate.format('YYYY-MM-DD')
        const dateTo = selectedToDate.format('YYYY-MM-DD')

        const suppliers = data.data.folders[4].folders
        const projects = data.data.folders[0].folders

        let supplierInfo = {}
        let projectList = []

        if (selectedSupplier == '') {
            console.log('non client pass')
            supplierInfo = clientList[0]
            for (let j = 0; j < projects.length; j++) {
                projectList.push(projects[j]) 
            }
        } else {
            for (let i = 0; i < suppliers.length; i++) {
                if (suppliers[i].name == selectedSupplier) {
                    supplierInfo = suppliers[i]
                    for (let j = 0; j < projects.length; j++) {
                        if (projects[j].suppliers.includes(selectedSupplier)) {
                            projectList.push(projects[j]) 
                        }
                    }
                    break
                }
            }
        }

        const dateFilter = (val) => {
            if (dateFrom == dateTo) {
                return true
            } else {
                return dayjs(val, 'DD/MM/YYYY').isAfter(dateFrom) && dayjs(val, 'DD/MM/YYYY').isBefore(dateTo)
            }
        }
        if (selectedFilter == 'COMP') {
            const filter = projectList.filter(proj => proj.status === 'COMP' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'QUO') {
            const filter = projectList.filter(proj => proj.status === 'QUO' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'OC') {
            const filter = projectList.filter(proj => proj.status === 'OC' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'OCS') {
            const filter = projectList.filter(proj => proj.status === 'OCS' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'CLS') {
            const filter = projectList.filter(proj => proj.status === 'CLS' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'High Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'HIGH' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'Medium Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'MEDIUM' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'Low Interest') {
            const filter = projectList.filter(proj => proj.interest.toUpperCase() === 'LOW' && dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == 'None') {
            const filter = projectList.filter(proj => dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        } else if (selectedFilter == '') {
            const filter = projectList.filter(proj => dateFilter(proj.date))
            projectList = []
            projectList.push(...filter)
            setProjectList(projectList)
        }
        console.log(supplierInfo, projectList)
        setSupplierInfo(supplierInfo)
        setClientReport(false)
        setSupplierReport(true)
        // setSupplierMetadata()
        handleGeneratePdf()
    }


	const handleGeneratePdf = () => {
		var doc = new jsPDF('p', 'pt', 'a4');

		// Adding the fonts.
		doc.setFont('Inter-Regular', 'normal');



		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('Triangle&Co Report');
			},
		});
	};

    return (
    <Card>
    <CardHeader
        subheader="Generate Reports from the list of Clients"
        title="Client Reports"
    />
    <Divider />

    <Grid container spacing={4}>
        <Grid item xs={3}>
            <CardContent>
                <Typography variant='body1'>Clients:</Typography>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl style={{ width: '200px' }}>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedClient}
                        label="Country"
                        onChange={(e) => {
                            setSelectedClient(e.target.value)
                        }}
                        >
                        {
                            clientNames.sort().map((cl) => (
                            <MenuItem value={cl}>{cl}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                </Box>
            </CardContent>
        </Grid>
        <Grid item xs={4}>
            <CardContent dateAdapter={AdapterDayjs}>
                <Typography variant='body1'>Date:</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DatePicker
                            label="From"
                            value={selectedFromCliDate}
                            onChange={(newValue) => {
                                setSelectedFromCliDate(dayjs(newValue))
                            }}
                            renderInput={(params) => <TextField {...params} />} // You need to define renderInput
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            label="To"
                            value={selectedToCliDate}
                            onChange={(newValue) => setSelectedToCliDate(dayjs(newValue))}
                            renderInput={(params) => <TextField {...params} />} // You need to define renderInput
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Grid>
        {/* filter */}
        <Grid item xs={3}>
            <CardContent>
                <Typography variant='body1'>Filter:</Typography>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl style={{ width: '200px' }}>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCliFilter}
                        label="Suppliers"
                        onChange={(e) => {
                            setSelectedCliFilter(e.target.value)
                        }}
                        >
                        {
                            ['None', 'CLS', 'QUO', 'OC', 'OCS', 'COMP', 'High Interest', 'Medium Interest', 'Low Interest'].map((cl) => (
                                <MenuItem value={cl}>{cl}</MenuItem>
                                ))
                        }
                        </Select>
                    </FormControl>
                </Box>
            </CardContent>
        </Grid>
        <Grid item xs={2}>
            <CardContent>
                <Button 
                    variant='contained'
                    style={{ top: 25 }}
                    onClick={() => generateClientReport()}
                >Generate</Button>
            </CardContent>
        </Grid>
    </Grid>
    <Divider />
    <Divider />
    <Divider />

    <CardHeader
        subheader="Generate Reports from the list of Suppliers"
        title="Supplier Reports"
    />
    <Divider />
    <Grid container spacing={4}>
        {/* supplier choice */}
        <Grid item xs={3}>
            <CardContent>
                <Typography variant='body1'>Supplier:</Typography>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl style={{ width: '200px' }}>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSupplier}
                        label="Country"
                        onChange={(e) => {
                            setSelectedSupplier(e.target.value)
                        }}
                        >
                        {
                            supplierList.map((cl) => (
                                <MenuItem value={cl}>{cl}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                </Box>
            </CardContent>
        </Grid>
        {/* date from / to */}
        <Grid item xs={4}>
            <CardContent dateAdapter={AdapterDayjs}>
                <Typography variant='body1'>Date:</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <DatePicker
                            label="From"
                            value={selectedFromDate}
                            onChange={(newValue) => {
                                setSelectedFromDate(dayjs(newValue))
                                console.log('newval: ', newValue)
                            }}
                            renderInput={(params) => <TextField {...params} />} // You need to define renderInput
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <DatePicker
                            label="To"
                            value={selectedToDate}
                            onChange={(newValue) => setSelectedToDate(dayjs(newValue))}
                            renderInput={(params) => <TextField {...params} />} // You need to define renderInput
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Grid>
        {/* filter */}
        <Grid item xs={3}>
            <CardContent>
                <Typography variant='body1'>Filter:</Typography>
                <Box sx={{ minWidth: 120 }}>
                    <FormControl style={{ width: '200px' }}>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedFilter}
                        label="Suppliers"
                        onChange={(e) => {
                            setSelectedFilter(e.target.value)
                        }}
                        >
                        {
                            ['None', 'CLS', 'QUO', 'OC', 'OCS', 'COMP', 'High Interest', 'Medium Interest', 'Low Interest'].map((cl) => (
                                <MenuItem value={cl}>{cl}</MenuItem>
                                ))
                        }
                        </Select>
                    </FormControl>
                </Box>
            </CardContent>
        </Grid>
        {/* button */}
        <Grid item xs={2}>
            <CardContent>
                <Button 
                    variant='contained' 
                    onClick={() => generateSupplierReport()}
                    style={{ top: 25 }}
                >Generate</Button>
            </CardContent>
        </Grid>
    </Grid>
    { console.log('fsi: ', finalClientInfo.name, supplierReport, clientReport)}
    { (finalProjectList != null && !clientReport && supplierReport) ? (
        // <center>
        //     <div ref={reportTemplateRef}>
        //         <ReportTemplate style={{ width: 150, height: 300 }} si={finalSupplierInfo} pl={finalProjectList} type={'supplier'}/>
        //     </div>
        // </center>
        <div ref={reportTemplateRef}>
            <ReportTemplate style={{ width: 250, height: 500 }} si={finalSupplierInfo} pl={finalProjectList} type={'supplier'}/>
        </div>
    ) : (finalProjectList != null && !supplierReport && clientReport) ? (
        <div ref={reportTemplateRef}>
            <ReportTemplate style={{ width: 150, height: 300 }} si={finalClientInfo} pl={finalProjectList} type={'client'}/>
        </div> 
    //     <div ref={reportTemplateRef} style={{ }}>
    //     <ReportTemplate style={{ width: 250, height: 500 }} si={finalClientInfo} pl={finalProjectList} type={'client'}/>
    // </div>  
    ) : null
    }
    </Card>
    );
};

// duyviswiener
// quipers
// bauhman
