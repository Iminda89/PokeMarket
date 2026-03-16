import React from 'react';

const VerificationNotice = () => {
    return (
        <div className="alert alert-warning mt-4 shadow-sm" style={{ borderRadius: '15px' }}>
            <h4 className="alert-heading">📧 Egiaztatu zure posta elektronikoa!</h4>
            <p>
                Erosketak egin ahal izateko, zure posta elektronikoa berretsi behar duzu. 
                Begiratu zure sarrera-ontzia (edo spam karpeta).
            </p>
            <hr />
            <p className="mb-0 small text-muted">
                Ez baduzu jaso, sakatu esteka hau berriro bidaltzeko.
            </p>
        </div>
    );
};

export default VerificationNotice;