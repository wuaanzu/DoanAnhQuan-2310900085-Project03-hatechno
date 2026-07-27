
document.addEventListener('DOMContentLoaded', function () {
    const addForm = document.getElementById('addEmployeeForm');

    if (addForm) {
        addForm.addEventListener('submit', function (e) {
            e.preventDefault();


            const code = document.getElementById('empCode').value;
            const name = document.getElementById('empName').value;
            const dept = document.getElementById('empDept').value;
            const role = document.getElementById('empRole').value;


            const tableBody = document.querySelector('#employeeTable tbody');
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td><strong>${code}</strong></td>
                <td>${name}</td>
                <td>${dept}</td>
                <td>${role}</td>
                <td><span class="badge bg-success">Chính thức</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary me-1"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-sm btn-outline-danger btn-delete"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;


            tableBody.appendChild(newRow);
            addForm.reset();


            const modalElement = document.getElementById('addEmployeeModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            alert('Thêm nhân viên thành công!');
        });
    }
});