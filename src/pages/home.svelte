<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Link,
    Block,
    BlockTitle,
    List,
    ListItem,
    Icon,
    Searchbar,
    NavRight,
    Chip,
    Sheet,
    PageContent,
    Button,
    Popup, ListInput, SwipeoutActions, SwipeoutButton, Card, CardContent, NavLeft, Badge, f7
  } from 'framework7-svelte';
  import {formatCurrency} from "../js/utils.js";
  import {SETTINGS, CLEAR_SETTINGS, UPDATE_SETTINGS, defaultSettings} from "../js/store";
  import {onMount} from "svelte";

  let toastTop;
  let settingsSheetOpened = false;
  let newItemSheetOpened = false;
  let openNewInvoice = false;
  let openPrintInvoice = false;
  let addRecipientSheet = false;
  let files;
  let hide = false;

  let invoices = [];
  $: noOfInvoices = invoices.length;

  $: files && files[0] && getBase64(files[0]);

  let settings = {
    businessName: "",
    businessLogo: null,
    currency: "₦",
    vat: 0,
  }

  let record = {
    id: null,
    date: null,
    billTo: "",
    items: [],
    total: 0,
    grandTotal: 0,
    timeStamp: null,
    currency: null,
    vat: null,
    memo:""
  };

  function calculateTotal() {
    record.total = 0;
    for (let i = 0; i < record.items.length; i++) {
      record.total += record.items[i].unitPrice * record.items[i].quantity;
    }
  }

  function removeItem(index) {
    record.items.splice(index, 1);
    calculateTotal();
  }

  function saveInvoice() {
    const records = JSON.parse(localStorage.getItem('invoices')) || [];
    record.grandTotal = record.total + (record.total * (settings.vat / 100));
    records.push(record);
    localStorage.setItem("invoices", JSON.stringify(records));
    invoices = getAllInvoices();
    openNewInvoice = false;
    clearInvoice();
  }

  function getAllInvoices(){
    return JSON.parse(localStorage.getItem('invoices'))
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)) || [];
  }

  function getBase64(image) {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
      settings.businessLogo = e.target.result;
    };
  };
  function getRandomLetter() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    return alphabet[randomIndex];
  }


  function newInvoice() {
    const rand = Math.floor(Math.random() * 10000);
    const currDate = date();
    record.id = `QKINV-${rand}${getRandomLetter().toUpperCase()}`;
    record.date = currDate;
    openNewInvoice = true;
    record.timeStamp = new Date().getTime();
    record.currency = settings.currency;
    record.vat = settings.vat;
  }

  const date = ()=> {
    const date = new Date();
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  let invoice = {
      itemDescription: '',
      quantity: null,
      unitPrice: null,
  }

  function clearForm() {
    invoice = {
      itemDescription: '',
      quantity: null,
      unitPrice: null,
    }
  }

  function clearInvoice(){
    record = {
      id: null,
      date: null,
      billTo: "",
      items: [],
      total: 0,
    };
  }

  function addItem() {
    record.items = [...record.items, invoice] // force svelte to re-render array
    clearForm();
    calculateTotal();
    showToastTop('Item added successfully')
  }

  function addRecipient() {
    capitalizeInput(record, "billTo")
  }

  function openPopup() {
    getSettings();
    settingsSheetOpened = true;
  }

 function getSettings() {
    const tempSettings = localStorage.getItem("settings");
    if (tempSettings) {
      settings = JSON.parse(tempSettings);
    }
 }

 function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(settings));
    settingsSheetOpened = false;
 }

  function clearSettings() {
    CLEAR_SETTINGS();
    setTimeout(getSettings, 0);
    files = [];
    settingsSheetOpened = false;
  }

  function removeInvoice(index) {
    invoices.splice(index, 1);
    invoices = [...invoices]; // force svelte to re-render array
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }

  function showToastTop(message) {
    if (!toastTop) {
      toastTop = f7.toast.create({
        text: `${message}`,
        position: 'top',
        closeTimeout: 1000,
      });
    }
    toastTop.open();
  }

  function capitalizeInput(object, property) {
    object[property] = object[property].toUpperCase();
  }

  let print;
  function printInvoice(index) {
    print = invoices[index];
    openPrintInvoice = true;
  }

  function printer(){
    setTimeout(() => window.print(), 500);
  }

  function closePrintInvoice() {
    openPrintInvoice = false;
    print = {};
  }

  async function shareApp() {
    const data  = { title: 'Coexcus', url: "<url>" };
    try {
      await navigator.share(data);
    }
    catch (e) {}
  }

 onMount(()=>{
    getSettings();
    invoices = getAllInvoices();
    clearInvoice();
 })
</script>
<Page name="home" class="print:hidden">
  <!-- Top Navbar -->
  <Navbar >
    <NavLeft>
      {#if $SETTINGS.businessLogo}
        <img src={$SETTINGS.businessLogo} alt={$SETTINGS.businessName + ' Logo'} class="w-8 h-8 rounded-full"/>
      {/if}
      <NavTitle>{$SETTINGS.businessName}</NavTitle>
    </NavLeft>

    <NavRight>
      {#if invoices.length > 4}
      <Link searchbarEnable=".searchbar" color="black" iconSize="" iconF7="search" />
      {/if}
      <Link class="!ml-0" iconF7="gear_alt" color="black" on:click={openPopup}></Link>
    </NavRight>
    <Searchbar
            class="searchbar"
            expandable
            searchContainer=".invoice-list"
            searchIn=".item-title"
    />
  </Navbar>
  <div class="absolute !z-[9999] left-1/2 bottom-5 transform -translate-x-1/2 w-auto min-w-[50px] shadow-lg rounded-full hover:shadow-xl ">
    <a class="bg-blue-600 relative flex items-center justify-center overflow-hidden z-10 text-white rounded-full hover:bg-blue-700" on:click={()=> newInvoice()}>
      <i class="icon f7-icons ml-3 text-[16px]">plus</i>
      <div class="box-border text-lg px-4 py-4 leading-3 font-normal !capitalize">Create</div>
    </a>
  </div>
  <BlockTitle>
    Invoices
    <Badge>{noOfInvoices}</Badge>
  </BlockTitle>
  <List dividersIos mediaList outlineIos strongIos
        class="invoice-list searchbar-found"
  >
    {#each invoices as invoice, i}
    <ListItem swipeout
              on:click={()=> printInvoice(i)}
            link="#"
            title="{invoice.id}"
            after="{invoice.date}"
            subtitle="Total: {invoice.currency + formatCurrency(invoice.total)}"
            text="Bill To: {invoice.billTo}"
              onSwipeoutDeleted={()=>removeInvoice(i)}
    >
      <SwipeoutActions right>
        <SwipeoutButton delete confirmText="Are you sure you want to delete this item?">
          Delete
        </SwipeoutButton>
      </SwipeoutActions>
    </ListItem>
      {/each}
    {#if invoices.length < 1}
      <ListItem title="No invoice has been created." />
    {/if}
  </List>
  <List strongIos outlineIos dividersIos class="searchbar-not-found">
    <ListItem title="Nothing found" />
  </List>
  <Sheet class="settings" style="height: auto" push backdrop opened={settingsSheetOpened}
         onSheetClosed={() => (settingsSheetOpened = false)}
  >
    <div class="swipe-handler"></div>
    <PageContent>
      <BlockTitle class="flex justify-between font-normal">
        <h1 class="font-bold text-xl">
          Settings
        </h1>
        <Link class="text-blue-600" sheetClose>
          <Icon f7="xmark" size="20"/>
        </Link>
      </BlockTitle>
      <Block>
        <List strongIos>
            <ListInput
                    bind:value={settings.businessName}
                    outline
                    label="Business Name"
                    type="text"
                    placeholder="Your Business Name"
                    clearButton
                    >

            </ListInput>
          <ListInput
                  outline
                  label="Business Logo"
                  clearButton
                  input={false}
          >
            <div slot="input">
              <input class="" id="file-to-upload" type="file" accept=".png,.jpg" bind:files/>
            </div>
          </ListInput>
          <ListInput
                  bind:value={settings.currency}
                  outline
                  label="Currency"
                  type="select"
          >
            <option value="₦">Naira</option>
            <option value="$">US Dollar</option>
            <option value="£">Pound Sterling</option>
            <option value="€">Euro</option>
            <option value="₹">Rupee</option>
          </ListInput>
          <ListInput
                  bind:value={settings.vat}
                  outline
                  label="VAT(%)"
                  type="number"
                  step="0.1"
                  placeholder="VAT"
          >
          </ListInput>
          <Block class="!m-0">
            <Button
                    sheetClose
                    disabled={settings.businessName === '' || settings.currency === '' || settings.vat === ''}
                    on:click={()=> saveSettings()}
                    class="rounded-lg bg-blue-600 w-full py-6 flex item-center text-white hover:bg-blue-700 focus:bg-blue-700 capitalize">
              Save
            </Button>
          </Block>
          {#if defaultSettings !== $SETTINGS}
          <Block class="mt-2">
            <Button
                    sheetClose
                    on:click={()=> clearSettings()}
                    class="rounded-lg bg-transparent border border-red-600 w-full py-6 flex item-center text-red-600 hover:bg-red-100 focus:bg-red-100 capitalize">
              Clear Settings
            </Button>
          </Block>
            {/if}
        </List>
      </Block>
    </PageContent>
  </Sheet>
  <Popup class="demo-popup" opened={openNewInvoice} onPopupClosed={() => (openNewInvoice = false)}>
    <Page>
      <Navbar>
        <NavLeft>
          {#if !newItemSheetOpened}
          <Link popupClose>Close</Link>
            {/if}
        </NavLeft>
        <NavTitle>New Invoice</NavTitle>
        <NavRight>
          <Button popupClose
                  disabled={record.billTo === '' || record.items.length === 0 || newItemSheetOpened}
                  on:click={()=> saveInvoice()}
                  class="bg-blue-600 w-full py-4 flex item-center !text-white hover:bg-blue-700 focus:bg-blue-700 capitalize">
            <Icon f7="checkmark" size="14px" class="mr-2" />
            Save
          </Button>
        </NavRight>
      </Navbar>
      <Card>
        <CardContent class="text-center bg-gray-100 border border-gray-300 rounded-lg">

          <p>Total Amount</p>
          <h1 class="font-bold text-2xl mt-2">
            {$SETTINGS.currency + formatCurrency(record.total) || 0}
          </h1>
        </CardContent>
      </Card>
      <Block>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-lg">
            Invoice
          </h1>
          <div>
            {record.id}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-lg">
            Date
          </h1>
          <div>
            {date()}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-lg">
            Bill To
          </h1>
          <div>
            {#if record.billTo !== ''}
              <span class="text-black">
                <a on:click={()=> addRecipientSheet = true} class="text-blue-600 hover:underline">
                {record.billTo}
                </a>
              </span>
            {:else }
            <a on:click={()=> addRecipientSheet = true} class="text-blue-600 hover:underline">Add Recipient</a>
              {/if}
          </div>
        </div>
      </Block>
      <Block>
        <div class="data-table data-table-init">
          <div class="card-content" style="padding-bottom: 4rem">
            <table>
              <thead class="rounded-lg">
              <tr class="bg-gray-50">
                <th class="label-cell"><b>Description</b></th>
                <th class="numeric-cell"><b>Quantity/Price</b></th>
                <th class="numeric-cell"><b>Total</b></th>
                <th></th>
              </tr>
              </thead>
              {#if record.items.length > 0}
              <tbody>
              {#each record.items as item,i}
                <tr>
                  <td class="label-cell whitespace-nowrap">{item.itemDescription}</td>
                  <td class="numeric-cell">{item.quantity} x {formatCurrency(item.unitPrice)}</td>
                  <td class="numeric-cell">{$SETTINGS.currency + formatCurrency(item.quantity * item.unitPrice)}</td>
                  <td class="actions-cell">
                    <a class="link icon-only" on:click={()=> removeItem(i)}>
                      <i class="icon f7-icons if-not-md text-red-500">trash</i>
                      <i class="icon material-icons md-only text-red-500">delete</i>
                    </a>
                  </td>
                </tr>
              {/each}
              </tbody>
              {/if}
            </table>
          </div>
        </div>
        <div class="margin-top">
          <Button
                  on:click={()=> newItemSheetOpened = true }
                  class="bg-transparent border border-blue-600 w-full py-5 flex item-center text-blue-600 hover:bg-blue-300 focus:bg-blue-300 capitalize">
            + Add Item
          </Button>
        </div>
      </Block>
      <Block>
        <div class="">
          <h1 class="font-bold text-lg">
            Memo
          </h1>
          <List strongIos class="bg-transparent !m-0">
              <ListInput
                      bind:value={record.memo}
                      outline
                      label="Memo"
                      type="textarea"
                      placeholder="Enter Description"
              >
              </ListInput>
          </List>
        </div>
      </Block>
      <Sheet class="add-item" style="height: 70vh" swipeToClose
             opened={newItemSheetOpened}
             onSheetClosed={() => (newItemSheetOpened = false)}
      >
        <div class="swipe-handler"></div>
        <PageContent>
          <BlockTitle class="flex justify-between font-normal">
            <h1 class="font-bold text-xl">
              New Item
            </h1>
            <Link color="blue" sheetClose>
              <Icon f7="xmark" size="20"/>
            </Link>
          </BlockTitle>
          <Block>

            <List strongIos>
              <ListInput
                      bind:value={invoice.itemDescription}
                      outline
                      label="Item Description"
                      type="text"
                      placeholder="Enter Description"
              >
              </ListInput>
              <ListInput
                      bind:value={invoice.quantity}
                      outline
                      min="1"
                      max="1000"
                      label="Quantity"
                      type="number"
                      step="1"
                      placeholder="Enter Quantity"
              >
              </ListInput>
              <ListInput
                      bind:value={invoice.unitPrice}
                      outline
                      label="Unit Price({$SETTINGS.currency})"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="Enter Unit Price"
              >
              </ListInput>
              <Block>
                <Button
                        disabled={!invoice.itemDescription || !invoice.quantity || !invoice.unitPrice}
                        on:click={addItem}
                        class="rounded-lg bg-blue-600 w-full py-6 flex item-center text-white hover:bg-blue-700 focus:bg-blue-700 capitalize">
                  Add Item
                </Button>
              </Block>
            </List>

          </Block>
        </PageContent>
      </Sheet>
      <Sheet class="add-item" style="height: 70vh" swipeToClose
             opened={addRecipientSheet}
             onSheetClosed={() => (addRecipientSheet = false)}
      >
        <div class="swipe-handler"></div>
        <PageContent>
          <BlockTitle class="flex justify-between font-normal">
            <h1 class="font-bold text-xl">
              Add Recipient
            </h1>
            <Link color="blue" sheetClose>
              <Icon f7="xmark" size="20"/>
            </Link>
          </BlockTitle>
          <Block>
            <List strongIos>
              <ListInput
                      bind:value={record.billTo}
                      outline
                      label="Name"
                      type="text"
                      placeholder="Enter Recipient Name"
              >
              </ListInput>
              <Block>
                <Button
                        disabled={!record.billTo}
                        sheetClose
                        on:click={addRecipient}
                        class="rounded-lg bg-blue-600 w-full py-6 flex item-center text-white hover:bg-blue-700 focus:bg-blue-700 capitalize">
                  Add
                </Button>
              </Block>
            </List>
          </Block>
        </PageContent>
      </Sheet>
    </Page>
  </Popup>
  <Popup class="demo-popup" opened={openPrintInvoice} onPopupClosed={() => (openPrintInvoice = false)} tabletFullscreen>
    <Page class="print:bg-white">
      <Navbar class="print:hidden">
        <NavLeft>
            <Link popupClose>Close</Link>
        </NavLeft>
        <NavTitle>Print {print?.id}</NavTitle>
        <NavRight>
          <Button
                  on:click={()=> printer()}
                  class="bg-blue-600 w-full py-4 flex item-center !text-white hover:bg-blue-700 focus:bg-blue-700 capitalize">
            <Icon f7="printer" size="14px" class="mr-2" />
            Print
          </Button>
        </NavRight>
      </Navbar>
      <Block>
        <div class="w-full flex flex-col justify-between items-center">
          <h1 class="w-full font-bold text-md flex gap-1 items-center print:text-xl">
            {#if $SETTINGS.businessLogo}
              <img src={$SETTINGS.businessLogo} alt={$SETTINGS.businessName + ' Logo'} class="w-8 h-8 rounded-full"/>
            {/if}
            {$SETTINGS.businessName}
          </h1>
        </div>
        <div class="my-4">
          <hr/>
        </div>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-md print:text-xl">
            Invoice No:
          </h1>
          <div class="print:text-xl">
            {print?.id}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-md print:text-xl">
            Date
          </h1>
          <div class="print:text-xl">
            {print?.date}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-md print:text-xl">
            Bill To
          </h1>
          <div class="print:text-xl">
            {print?.billTo}
          </div>
        </div>
      </Block>
      <Block>
        <div class="data-table data-table-init">
          <div class="card-content" style="padding-bottom: 2rem">
              <table class="table-auto">
                <thead>
                <tr class="bg-gray-50">
                  <th class="label-cell"><b class="print:text-lg">Description</b></th>
<!--                  <th class="numeric-cell print:hidden"><b>Quantity/Price</b></th>-->

                  <th class="numeric-cell"><b class="print:text-lg">Quantity</b></th>
                  <th class="numeric-cell"><b class="print:text-lg">Price</b></th>

                  <th class="numeric-cell"><b class="print:text-lg">Total</b></th>
                </tr>
                </thead>
                <tbody>
                {#if print?.items}
                  {#each print.items as item}
                    <tr>
                      <td class="label-cell"><p class="print:text-lg">{item.itemDescription}</p></td>
<!--                      <td class="numeric-cell print:hidden"><p>{item.quantity} * {formatCurrency(item.unitPrice)}</p></td>-->

                      <td class="numeric-cell"><p class="print:text-lg">{item.quantity}</p></td>
                      <td class="numeric-cell"><p class="print:text-lg">{formatCurrency(item.unitPrice)}</p></td>

                      <td class="numeric-cell"><p class="print:text-lg">{print?.currency + formatCurrency(item.quantity * item.unitPrice)}</p></td>
                    </tr>
                  {/each}
                {/if}
                </tbody>
                <tfoot>
                <tr class="border-t-2 print:mt-3">
                  <td></td>
                  <td></td>
                  <td class="label-cell"><b class="print:text-lg font-bold">Total</b></td>
                  <td class="numeric-cell"><b class="print:text-lg">{print?.currency + formatCurrency(print?.total)}</b></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td class="label-cell whitespace-nowrap"><b class="print:text-lg font-bold">Grand Total(+VAT)</b></td>
                  <td class="numeric-cell"><b class="print:text-lg">{print?.currency + formatCurrency(print?.grandTotal)}</b></td>
                </tr>
                </tfoot>
              </table>
          </div>
        </div>
      </Block>
      {#if print?.memo !== ""}
      <Block>
        <div class="">
          <h1 class="font-bold text-md print:text-xl">
            Memo
          </h1>
          <div class="text-sm print:text-lg">
            {print?.memo}
          </div>
        </div>
      </Block>
        {/if}
    </Page>
  </Popup>
</Page>
