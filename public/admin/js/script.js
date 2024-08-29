//bt status
const buttonsStatus = document.querySelectorAll("[button-status]")
if(buttonsStatus.length > 0){
    buttonsStatus.forEach(button => {
        const url = new URL(window.location.href)
        button.addEventListener("click",() => {
            const status = button.getAttribute("button-status")
            
            if(status){
                url.searchParams.set("status",status)
            }else{
                url.searchParams.delete("status")
            }
            window.location.href = url.href
        })
    })
}
//form search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit",(e) => {
        e.preventDefault()
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword",keyword)
        }else{
            url.searchParams.delete("keyword")
        }
        window.location.href = url.href
    })
}

//pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")

if(buttonPagination){
    let url = new URL(window.location.href)
        buttonPagination.forEach(button => {
            button.addEventListener("click",() => {
                const page = button.getAttribute("button-pagination")

                url.searchParams.set("page", page)

                window.location.href = url.href
    })
})
}

//checkBox-multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputId.forEach(input => {
                input.checked = true;
            });
        }
        else {
            inputId.forEach(input => {
                input.checked = false;
            });
        }
    })

    inputId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length;

            if (countChecked == inputId.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })
    })
}

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]")
if(formChangeMulti){
    formChangeMulti.addEventListener("submit",(e) => {
        e.preventDefault()
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        )
        
        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete-all"){
            const isConfirm = confirm("Sure ?")
            if(!isConfirm){
                return;
            }
        }


        if(inputsChecked.length > 0) {
            let ids = []
            const inputIds = formChangeMulti.querySelector("input[name='ids']")
            inputsChecked.forEach(input => {
                const id = input.value

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value
                    console.log(`${id}-${position}`)
                    ids.push(`${id}-${position}`)
                }else{
                    ids.push(id)
                }
               
            })
            console.log(ids.join(", "))
            inputIds.value = ids.join(", ")

            formChangeMulti.submit()
        }else{
            alert("Nhap ban ghi de")
        }
    })
}

//Show alert
const showAlert = document.querySelector("[show-alert]")
if(showAlert){
    const time = showAlert.getAttribute("data-time")
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time);

    closeAlert.addEventListener("click",() => {
        showAlert.classList.add("alert-hidden")
    })

}

//upload
const uploadImage = document.querySelector("[upload-image]")

if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]")
    const uploadImagePreview = document.querySelector("[upload-image-preview]")

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file)
        }
    })
}

// const closeImage = document.querySelector("[close-image]")

// if(closeImage){
//     closeImage.addEventListener("click",() => {
//         document.querySelector("[upload-image-input]").value = ""
//         document.querySelector("[upload-image-preview]").src = ""
//     })
// }