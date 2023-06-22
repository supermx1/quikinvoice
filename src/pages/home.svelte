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
    Fab,
    Searchbar,
    NavRight,
    Chip,
    Sheet,
    PageContent,
    Button,
    Popup, ListInput, SwipeoutActions, SwipeoutButton, Card, CardContent,
  } from 'framework7-svelte';
  import {INVOICE, SETTINGS} from "@/js/store";
  import {formatCurrency} from "@/js/utils";

  let openNewInvoice = false;





</script>

<Page name="home">
  <!-- Top Navbar -->
  <Navbar >
    <NavTitle>Quik Invoice</NavTitle>
    <NavRight>
      <Link searchbarEnable=".searchbar-demo" iconSize="" iconF7="search" />
      <Link iconF7="gear_alt" iconSize="" sheetOpen=".demo-sheet-swipe-to-close"></Link>

    </NavRight>
    <Searchbar
            class="searchbar-demo"
            expandable
            searchContainer=".search-list"
            searchIn=".item-title"
    />
  </Navbar>
  <Fab position="center-bottom" text="Create" on:click={()=> openNewInvoice = true }>
    <Icon ios="f7:plus" md="material:add" />
  </Fab>
  <BlockTitle>Invoices</BlockTitle>
  <Block>
    <Chip
            text="Shared"
            mediaBgColor="green"
            iconF7="cloud_upload_fill"
    />
    <Chip text="Unshared" mediaBgColor="yellow" iconF7="cloud_download_fill" />
  </Block>

  <List dividersIos mediaList outlineIos strongIos>
    <ListItem swipeout
            link="#"
            title="Facebook"
            after="17:14"
            subtitle="New messages from John Doe"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."
    >
      <SwipeoutActions right>
        <SwipeoutButton delete confirmText="Are you sure you want to delete this item?">
          Delete
        </SwipeoutButton>
      </SwipeoutActions>
    </ListItem>
  </List>

  <Sheet class="demo-sheet-swipe-to-close" style="height: auto" swipeToClose push backdrop>
    <div class="swipe-handler"></div>
    <PageContent>
      <BlockTitle large>Settings</BlockTitle>
      <Block>
<!--        <p>-->
<!--          Looking for a mobile app to create and share invoices on-the-go? With just a few taps on your mobile device, you can create professional-looking invoices, and get paid faster. Quik Invoice app has all the necessary elements for an invoice app, including the ability to create customized invoices, store client information, and send invoices and receive payments instantly.-->
<!--        </p>-->


        <List strongIos dividersIos insetIos>
            <ListInput
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
                  type="file"
                  placeholder="Your Logo"
                  clearButton
          >
          </ListInput>
          <ListInput
                  outline
                  label="Currency"
                  type="select"
                  value="₦"
          >
            <option value="₦">Naira</option>
            <option value="$">US Dollar</option>
          </ListInput>
          <ListInput
                  outline
                  label="VAT(%)"
                  type="number"
                  step="0.1"
                  placeholder="VAT"
          >

          </ListInput>
          <Block>
            <Button tonal>Save</Button>
          </Block>

        </List>

      </Block>
    </PageContent>
  </Sheet>
  
  
  <Popup class="demo-popup" opened={openNewInvoice} onPopupClosed={() => (openNewInvoice = false)}>
    <Page>
      <Navbar title="New Invoice">
        <NavRight>
          <Link popupClose>Close</Link>
        </NavRight>
      </Navbar>
      <Block>
        <div class="flex justify-between items-center">
          <h1 class="font-bold text-2xl">
            Invoice
          </h1>
          <div>
            {$INVOICE.id}
          </div>
        </div>
      </Block>

      <Card>
        <CardContent class="text-center">

          <p>Total Amount</p>
          <h1 class="font-bold text-2xl mt-2">
            {$SETTINGS.currency + formatCurrency(8900.90) || 0}
          </h1>
        </CardContent>
      </Card>

      <Block>
        <div class="data-table data-table-init">
          <div class="card-content" style="padding-bottom: 4rem">
            <table>
              <thead>
              <tr>
                <th class="checkbox-cell">
                  <label class="checkbox">
                    <input type="checkbox" />
                    <i class="icon-checkbox"></i>
                  </label>
                </th>
                <th class="label-cell"><b>Description</b></th>
                <th class="numeric-cell"><b>Quantity/Price</b></th>
                <th class="numeric-cell"><b>Total</b></th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td class="checkbox-cell">
                  <label class="checkbox">
                    <input type="checkbox" />
                    <i class="icon-checkbox"></i>
                  </label>
                </td>
                <td class="label-cell whitespace-nowrap">Web Design</td>
                <td class="numeric-cell">1 x 97,000</td>
                <td class="numeric-cell">97,000</td>
                <td class="actions-cell">
                  <a class="link icon-only">
                    <i class="icon f7-icons if-not-md text-red-500">trash</i>
                    <i class="icon material-icons md-only text-red-500">delete</i>
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="margin-top">
          <Button fill color="blue">+ Add Item</Button>
        </div>


      </Block>
    </Page>
  </Popup>


</Page>
