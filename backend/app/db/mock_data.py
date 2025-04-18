from app.models.patient import Patient
from app.models.treatment import TreatmentPlan

patients = [
    Patient(
        id="1",
        name="Jane Smith",
        age=62,
        diagnosis="Breast Cancer Stage II",
        riskLevel="Medium",
        status="Stable",
        lastUpdate="2 days ago",
        avatar="/contemplative-artist.png"
    ),
    Patient(
        id="2",
        name="Robert Johnson",
        age=71,
        diagnosis="Lung Cancer Stage III",
        riskLevel="High",
        status="High-Risk",
        lastUpdate="Today",
        avatar="/contemplative-elder.png"
    ),
    Patient(
        id="3",
        name="Maria Garcia",
        age=54,
        diagnosis="Colorectal Cancer Stage I",
        riskLevel="Low",
        status="Stable",
        lastUpdate="1 week ago",
        avatar="/contemplative-artist.png"
    ),
    Patient(
        id="4",
        name="David Lee",
        age=67,
        diagnosis="Prostate Cancer",
        riskLevel="Medium",
        status="Awaiting Upload",
        lastUpdate="3 days ago",
        avatar="/thoughtful-urbanite.png"
    ),
    Patient(
        id="5",
        name="Sarah Williams",
        age=45,
        diagnosis="Thyroid Cancer",
        riskLevel="Low",
        status="Stable",
        lastUpdate="5 days ago",
        avatar="/contemplative-artist.png"
    ),
    Patient(
        id="6",
        name="Michael Brown",
        age=59,
        diagnosis="Melanoma Stage II",
        riskLevel="Medium",
        status="New Patient",
        lastUpdate="Just now",
        avatar="/thoughtful-urbanite.png"
    )
]

treatment_plans = [
    TreatmentPlan(
        id="t1",
        patientId="1",
        recommendation="Hormone therapy (Tamoxifen) for 5-10 years without adjuvant chemotherapy",
        rationale="Patient has ER+/PR+ breast cancer with low Ki-67 proliferation index, negative lymph nodes, and low genomic recurrence score. Molecular profiling indicates low risk of recurrence with endocrine therapy alone.",
        confidence=87,
        dataPoints=1240,
        createdAt="2025-04-10T14:32:00Z",
        updatedAt="2025-04-10T14:32:00Z"
    ),
    TreatmentPlan(
        id="t2",
        patientId="2",
        recommendation="Combination chemotherapy (cisplatin/pemetrexed) followed by immunotherapy maintenance",
        rationale="Patient has stage III non-small cell lung cancer with high PD-L1 expression. Genomic analysis shows no targetable mutations. Recent clinical trials demonstrate survival benefit with this approach.",
        confidence=82,
        dataPoints=950,
        createdAt="2025-04-12T09:15:00Z",
        updatedAt="2025-04-12T09:15:00Z"
    ),
    TreatmentPlan(
        id="t3",
        patientId="3",
        recommendation="Surgical resection followed by adjuvant FOLFOX chemotherapy for 3 months",
        rationale="Patient has stage I colorectal cancer with microsatellite stability and low-risk features. Short-course adjuvant therapy is recommended based on recent trials showing non-inferiority to 6-month regimens.",
        confidence=91,
        dataPoints=1580,
        createdAt="2025-04-08T11:20:00Z",
        updatedAt="2025-04-08T11:20:00Z"
    )
]