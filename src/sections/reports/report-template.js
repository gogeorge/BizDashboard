import React, { useEffect, useState } from 'react';

const ReportTemplate = ({ si, pl, type }) => {

    const styles = {
        canvas:  {
            width: '50%',
            height: 1000,
            backgroundColor: 'white',
        },
        ms_logo: {
            width: 60,
            height: 60,
            position: 'relative',
            left: 0,
            top: 30,
        },
        logo_title: {
            fontFamily: 'Helvetica, sans-serif',
            fontSize: 20,
            position: 'relative',
            left: 55,
            top: -15,
        },

        container: {
            lineHeight: 0.7,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 8,
            marginLeft: '5rem',
			marginRight: '5rem',
            width: '50%',
            top: 20
        },
        leftColumn: {
            lineHeight: 0.7,
            flex: 1,
            marginRight: '10px', // Adjust the spacing between the columns as needed
        },
        rightColumn: {
            lineHeight: 0.7,
            flex: 1,
            marginLeft: '10px', // Adjust the spacing between the columns as needed
        },
        page: {
            marginLeft: '2rem',
			marginRight: '2rem',
        },
        project_container: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            marginBottom: '20px',
            width: '40%',
            fontSize: 7,
            marginLeft: '3rem',
			marginRight: '2rem',
            marginTop: '1rem'
        },
        column: {
            // border: '1px solid black',
            padding: '10px',
            fontSize: 7
        },
        columnGreen: {
            border: '1px solid black',
            padding: '10px',
            fontSize: 7, 
            backgroundColor: 'green' 
        }
    }

    return (
        (si.contacts != undefined && pl != undefined) && (
        <>
        <div style={styles.page}>
            <img style={styles.ms_logo} src="/assets/logos/ms-black.png"/>
            <div style={styles.logo_title}>Triangle & Co</div>
        </div>
        {
            si.name == 'ALL CLIENTS' ? (
                <center style={{width: '50%'}}><p style={{fontSize: 14}}>ALL CLIENTS</p></center>
            ) : (si.name == 'ALL SUPPLIERS') ? (
                <center style={{width: '50%'}}><p style={{fontSize: 14}}>ALL SUPPLIERS</p></center>
            ) : (
                <div>
                    <center style={{width: '50%'}}><p style={{fontSize: 14}}>{si.name}</p></center>
                    <div style={styles.container} >
                        <div style={styles.leftColumn}>
                            { type == 'client' ? 'Client' : 'Supplier' } Information:
                            <p style={{color: 'grey'}}>VAT: {si.vat}</p>
                            <p style={{color: 'grey'}}>Country: {si.country}</p>
                            <p style={{color: 'grey'}}>Address: {si.address}</p>
                            <p style={{color: 'grey'}}>Website: {si.webpage}</p>
                        </div>
                        <div style={styles.rightColumn}>
                            { type == 'client' ? 'Client' : 'Supplier'} Contact:
                            <p style={{color: 'grey'}}>Name: {si.contacts[0].name}</p>
                            <p style={{color: 'grey'}}>Country: {si.contacts[0].jobTitle}</p>
                            <p style={{color: 'grey'}}>Email: {si.contacts[0].email}</p>
                            <p style={{color: 'grey'}}>Tel: {si.contacts[0].mobTel}</p>
                        </div>
                    </div>
                </div>
            )
        }
        <hr />
        <div style={styles.project_container}>
            <div style={{ ...styles.column, width: '140px' }}><i>Name</i></div>
            <div style={{ ...styles.column, width: '80px' }}><i>ID</i></div>
            <div style={{ ...styles.column, width: '0px' }}><i>Client</i></div>
            <div style={{ ...styles.column, width: '0px' }}><i>Country</i></div>
            <div style={{ ...styles.column, width: '0px' }}><i>Date</i></div>
            <div style={{ ...styles.column, width: '0px' }}><i>Status</i></div>
            <div style={{ ...styles.column, width: '0px' }}><i>Interest</i></div>
        </div>
        {pl.map((p, i) => {
            return (
            <div> 
                <div style={styles.project_container}>
                    <div style={{ ...styles.column, width: '150px', position: 'relative', top: -8 }}><b>{p.name.length > 25 ? p.name.substring(0, 15) + ' ... ' + p.name.substring(15, 25): p.name}</b></div>
                    <div styles={styles.column}>{p.projectId}</div>
                    <div styles={styles.column}>{p.client}</div>
                    <div styles={styles.column}>{p.country}</div>
                    <div styles={styles.column}>{p.date}</div>
                    {/* {p.status == 'COMP' ? 
                    <div styles={styles.columnGreen}>{p.status}</div> :
                    <div styles={styles.column}>{p.status}</div>
                    } */}
                    <div styles={styles.column}>{p.status}</div>
                    <div styles={styles.column}>{p.interest}</div>
                </div>
            </div>)
        })}
        </>
        )
    )
}

export default ReportTemplate