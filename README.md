<div align="left">

[![Visit Clickfunnels](./header.png)](https://www.clickfunnels.com&#x2F;)

# [Clickfunnels](https://www.clickfunnels.com&#x2F;)<a id="clickfunnels"></a>

# Introduction<a id="introduction"></a>

The ClickFunnels v2 API lets you:

- import data from other apps and sources into ClickFunnels and export data that you need somewhere else
- extend the ClickFunnels platform to your own needs and embed it in your own applications
- act on behalf of other ClickFunnels users via OAuth to offer extended services to other fellow ClickFunnels entrepreneurs

We are starting with exposing a given set of resources but the goal is to converge in terms of
functionality with what the actual app is offering and also offering functionality on top.

For any feedback, please drop us a line at:

- https://feedback.myclickfunnels.com/feature-requests?category=api

For issues and support you can currently go here:

- https://help.clickfunnels.com/hc/en-us

# Authentication<a id="authentication"></a>

Making your first request is easiest with a Bearer token:

```shell
$ curl 'https://myteam.myclickfunnels.com/api/v2/teams' \
--header 'Authorization: Bearer AVJrj0ZMJ-xoraUk1xxVM6UuL9KXmsWmnJvvSosUO6X'
[{"id":3,"name":"My Team", # ... more output...}]
```

How to get your API key step by step:

https://developers.myclickfunnels.com/docs/getting-started

# Rate limiting<a id="rate-limiting"></a>

The rate limit is currently set per IP address.

The actual rate limit and the approach on how this is handled is subject to change in future
releases. Please let us know if you have special request limit needs.

# Pagination and Ordering<a id="pagination-and-ordering"></a>

In order to paginate through a large list response, you can use our cursor-based pagination using
the `id` field of a given object in the list.

There is a limit of 20 objects per list response ordered ascending by ID. So, you can get to items
after the last one in the list, by taking the last item's ID and submitting it in a list request
as the value of an `after` URL parameter. For example:

```shell
# The first 20 contacts are returned without any pagination nor ordering params:
$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts' --header 'Authorization: Bearer ...'
[{"id": 1, "email_address": "first@contact.com" ...}, {"id": 4, ...} ... {"id": 55, "email_address": "last@contact.com", ...}]

$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?after=55' --header 'Authorization: Bearer ...'
[{"id": 56, ...}] # There is one more record after ID 55.
```

The `after` param always acts as if you are "turning the next page". So if you order in a descending
order, you will also use `after` to get to the next records:

```shell
$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?sort_order=desc' --header 'Authorization: Bearer ...'
[{"id": 56, ...},  {"id": 55, ...}, {"id": 4, ...}] # All contacts in descending order.

$ curl 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?sort_order=desc&after=4' --header 'Authorization: Bearer ...'
[{"id": 1, ...}] # There is one more contact on the next page after ID 55.
```

You can also use the `Pagination-Next` header to get the last ID value directly:

```http request
# Example header.
Pagination-Next: 55
```

And you can use the `Link` header to get the next page directly without needing to calculate it
yourself:

```http request
# Example header.
Link: <https://localteam.myclickfunnels.com/api/v2/workspaces/3/contacts?after=55>; rel="next"
```

# Filtering<a id="filtering"></a>

**Current filters**

If filtering is available for a specific endpoint, 'filter' will be listed as one of the options in the query parameters section of the Request area. Attributes by which you can filter will be listed as well.

**How it works**

There is a filter mechanism that adheres to some simple conventions. The filters provided on
list endpoints, like `filter[email_address]` and `filter[id]` on the `Contacts` list endpoint, need
to be "simple" and "fast". These filters are supposed to be easy to use and allow you to filter by
one or more concrete values.

Here's an example of how you could use the filter to find a contact with a certain email address:

```shell
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com' --header 'Authorization: Bearer ...'
[{"email_address": "you@cf.com",...}]
```

You can also filter by multiple values:

```shell
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com,u2@cf.com' --header 'Authorization: Bearer ...'
[{"email_address": "you@cf.com",...}, {"email_address": "u2@cf.com",...}]
```

You can also filter by multiple attributes. Similar to filters that you might be familiar with when
using GitHub (e.g.: filtering PRs by closed and assignee), those filters are `AND` filters, which
give you the intersection of multiple records:

```shell
# If you@cf.com comes with an ID of 1, you will only see this record for this API call:
$ curl -g 'https://myteam.myclickfunnels.com/api/v2/workspaces/3/contacts?filter[email_address]=you@cf.com,u2@cf.com&filter[id]=1' --header 'Authorization: Bearer ...'
[{"email_address": "you@cf.com",...}] 
# u2@cf.com is not included because it has a different ID that is not included in the filter.
```

> Please let us know your use case if you need more filter or complex search capabilities, we are 
> actively improving these areas: https://feedback.myclickfunnels.com/feature-requests?category=api

# Webhooks<a id="webhooks"></a>

ClickFunnels webhooks allow you to react to many events in the ClickFunnels app on your own server, 
Zapier and other similar tools.

You need to configure one or more endpoints within the ClickFunnels API by using the [Webhooks::Outgoing::Endpoints](https://apidocs.myclickfunnels.com/tag/Webhooks::Outgoing::Endpoint) 
endpoint with the `event_type_ids` that you want to listen to (see below for all types).

Once configured, you will receive POST requrests from us to the configured endpoint URL with the
[Webhooks::Outgoing::Event](https://apidocs.myclickfunnels.com/tag/Webhooks::Outgoing::Event#operation/getWebhooksOutgoingEvents) 
payload, that will contain the subject payload in the `data` property. Like here for the
`contact.identified` webhook in V2 version:

```json
{
  "id": null,
  "public_id": "YVIOwX",
  "workspace_id": 32,
  "uuid": "94856650751bb2c141fc38436fd699cb",
  "event_type_id": "contact.identified",
  "subject_id": 100,
  "subject_type": "Contact",
  "data": {
    "id": 12,
    "public_id": "fdPJAZ",
    "workspace_id": 32,
    "anonymous": null,
    "email_address": "joe.doe@example.com",
    "first_name": "Joe",
    "last_name": "Doe",
    "phone_number": "1-241-822-5555",
    "time_zone": "Pacific Time (US & Canada)",
    "uuid": "26281ba2-7d3b-524d-8ea3-b01ff8414120",
    "unsubscribed_at": null,
    "last_notification_email_sent_at": null,
    "fb_url": "https://www.facebook.com/example",
    "twitter_url": "https://twitter.com/example",
    "instagram_url": "https://instagram.com/example",
    "linkedin_url": "https://www.linkedin.com/in/example",
    "website_url": "https://example.com",
    "created_at": "2023-12-31T18:57:40.871Z",
    "updated_at": "2023-12-31T18:57:40.872Z",
    "tags": [
      {
        "id": 20,
        "public_id": "bRkQrc",
        "name": "Example Tag",
        "color": "#59b0a8"
      }
    ]
  },
  "created_at": "2023-12-31T18:57:41.872Z"
}
```

The content of the `data` property will vary depending on the event type that you are receiving.

Event types are structured like this: `subject.action`. So, for a `contact.identified` webhook, your
`data` payload will contain data that you can source from [the contact response schema/example in the
documentation](https://apidocs.myclickfunnels.com/tag/Contact#operation/getContacts). Similarly, for
webhooks like `order.created` and `one-time-order.identified`, you will find the documentation in
[the Order resource description](https://apidocs.myclickfunnels.com/tag/Order#operation/getOrders).

**Contact webhooks**

Are delivered with [the Contact data payload](https://apidocs.myclickfunnels.com/tag/Contact#operation/getContacts).

| <div style="width:375px;">Event type</div>| Versions available | Description                                                            | 
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Contact***                                    |                    |                                                                        |
| `contact.created`                                | V1, V2             | Sent when a Contact is created                                         |
| `contact.updated`                                | V1, V2             | Sent when a Contact is updated                                         |
| `contact.deleted`                                | V1, V2             | Sent when a Contact is deleted                                         |
| `contact.identified`                             | V1, V2             | Sent when a Contact is identified by email address and/or phone number |
| `contact.unsubscribed`                           | V1, V2             | Sent when a Contact unsubscribes from getting communications from the ClickFunnels workspace                         |

**Contact::AppliedTag webhooks**

Are delivered with [the Contact::AppliedTag data payload](https://apidocs.myclickfunnels.com/tag/Contacts::AppliedTag#operation/getContactsAppliedTags)

| <div style="width:375px;">Event type</div>| Versions available | Description                                                            |
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Contacts::AppliedTag***                       |                    |                                                                        |
| `contact/applied_tag.created`                    | V2                 | Sent when a Contacts::AppliedTag is created                            |
| `contact/applied_tag.deleted`                    | V2                 | Sent when a Contacts::AppliedTag is deleted

**Courses webhooks**

Payloads correspond to the respective API resources:

- [Course](https://apidocs.myclickfunnels.com/tag/Course#operation/getCourses)
- [Courses::Enrollment](https://apidocs.myclickfunnels.com/tag/Courses::Enrollment#operation/getCoursesEnrollments)
- [Courses::Section](https://apidocs.myclickfunnels.com/tag/Courses::Section#operation/getCoursesSections)
- [Courses::Lesson](https://apidocs.myclickfunnels.com/tag/Courses::Lesson#operation/getCoursesLessons)

| <div style="width:375px;">Event type</div>| Versions available | Description                                                            | 
|--------------------------------------------------|--------------------|------------------------------------------------------------------------|
| ***Course***                                     |                    |                                                                        |
| `course.created`                                 | V2             | Sent when a Course is created                                          |
| `course.updated`                                 | V2             | Sent when a Course is updated                                          |
| `course.deleted`                                 | V2             | Sent when a Course is deleted                                          |
| `course.published`                               | V2                 | Sent when a Course has been published                                  |
| ***Courses::Enrollment***                        |                    |                                                                        |
| `courses/enrollment.created`                     | V2             | Sent when a Course::Enrollment is created                              |
| `courses/enrollment.updated`                     | V2             | Sent when a Course::Enrollment is updated                              |
| `courses/enrollment.deleted`                     | V2             | Sent when a Course::Enrollment is deleted                              |
| `courses/enrollment.suspended`                   | V2                 | Sent when a Course::Enrollment has been suspended                      |
| `courses/enrollment.course_completed`                   | V2                 | Sent when a Course::Enrollment completes a course                      |
| 
***Courses::Section***                           |                    |                                                                        |
| `courses/section.created`                        | V2             | Sent when a Courses::Section is created                                |
| `courses/section.updated`                        | V2             | Sent when a Courses::Section is updated                                |
| `courses/section.deleted`                        | V2             | Sent when a Courses::Section is deleted                                |
| `courses/section.published`                       | V2                 | Sent when a Courses::Lesson has been published                         |
|                      |
***Courses::Lesson***                            |                    |                                                                        |
| `courses/lesson.created`                         | V2             | Sent when a Courses::Lesson is created                                 |
| `courses/lesson.updated`                         | V2             | Sent when a Courses::Lesson is updated                                 |
| `courses/lesson.deleted`                         | V2             | Sent when a Courses::Lesson is deleted                                 |
| `courses/lesson.published`                       | V2                 | Sent when a Courses::Lesson has been published                         |
|                      |

**Form submission webhooks**

Currently only available in V1 with the following JSON payload sample:

```json
{
  "data": {
    "id": "4892034",
    "type": "form_submission",
    "attributes": {
      "id": 9874322,
      "data": {
        "action": "submit",
        "contact": {
          "email": "joe.doe@example.com",
          "aff_sub": "43242122e8c15480e9117143ce806d111"
        },
        "controller": "user_pages/pages",
        "redirect_to": "https://www.example.com/thank-you-newsletter"
      },
      "page_id": 2342324,
      "contact_id": 234424,
      "created_at": "2023-11-14T23:25:54.070Z",
      "updated_at": "2023-11-14T23:25:54.134Z",
      "workspace_id": 11
    }
  },
  "event_id": "bb50ab45-3da8-4532-9d7e-1c85d159ee71",
  "event_type": "form_submission.created",
  "subject_id": 9894793,
  "subject_type": "FormSubmission"
}
```

| <div style="width:375px;">Event type</div>| Versions available | Description                             | 
|--------------------------------------------------|--------------------|-----------------------------------------|
| ***Form::Submission***                           |                    |                                         |
| `form/submission.created`                        | V1                 | Sent when a Form::Submission is created |

**Order webhooks**

Subscriptions and orders are all of type "Order" and their payload will be as in the [Order resources
response payload](https://apidocs.myclickfunnels.com/tag/Order#operation/getOrders).

| <div style="width:375px;">Event type</div> | Versions available | Description                                                                                               | 
|--------------------------------------------|--------------------|-----------------------------------------------------------------------------------------------------------|
| ***Order***                                |                    |                                                                                                           |
| `order.created`                            | V1, V2             | Sent when an Order has been created                                                                       |
| `order.updated`                            | V1, V2             | Sent when an Order has been updated                                                                       |
| `order.deleted`                            | V1, V2             | Sent when an Order has been deleted                                                                       |
| `order.completed`                          | V1, V2             | Sent when a one-time order was paid or a subscription order's service period has concluded                |
| ***One-Time Order***                       |                    |                                                                                                           |
| `one-time-order.completed`                 | V1, V2             | Sent when an Order of `order_type: "one-time-order"` has been completed                                   |
| `one_time_order.refunded`                  | V1, V2             | Sent when an Order of `order_type: "one-time-order"` refund has been issued                               |
| ***Subscription***                         |                    |                                                                                                           |
| `subscription.canceled`                    | V1, V2             | Sent when an Order of `order_type: "subscription"` has been canceled                                      |
| `subscription.reactivated`                 | V1, V2             | Sent when an Order of `order_type: "subscription"` that was canceled was reactivated                      |
| `subscription.downgraded`                  | V1, V2             | Sent when an Order of `order_type: "subscription"` is changed to a product of smaller value               |
| `subscription.upgraded`                    | V1, V2             | Sent when an Order of `order_type: "subscription"` is changed to a product of higher value                |
| `subscription.churned`                     | V1, V2             | Sent when an Order of `order_type: "subscription"` has been churned                                       |
| `subscription.modified`                    | V1, V2             | Sent when an Order of `order_type: "subscription"` has been modified                                      |
| `subscription.activated`                   | V1, V2             | Sent when an Order of `order_type: "subscription"` has been activated                                     |
| `subscription.completed`                   | V1, V2             | Sent when an Order of `order_type: "subscription"` has been completed                                     |
| `subscription.first_payment_received`      | V1, V2             | Sent when an Order of `order_type: "subscription"` received first non-setup payment for subscription item |

**Orders::Transaction Webhooks**

Orders transactions are currently not part of our V2 API, but you can refer to this sample V2 webhook data payload: 

```json
{
  "id": 1821233,
  "arn": null,
  "amount": "200.00",
  "reason": null,
  "result": "approved",
  "status": "completed",
  "currency": "USD",
  "order_id": 110030,
  "is_rebill": false,
  "public_id": "asLOAY",
  "created_at": "2024-01-30T06:25:06.754Z",
  "updated_at": "2024-01-30T06:25:06.754Z",
  "external_id": "txn_01HNCGNQE2C234PCFNERD2AVFZ",
  "external_type": "sale",
  "rebill_number": 0,
  "adjusted_transaction_id": null,
  "billing_payment_instruction_id": 1333223,
  "billing_payment_instruction_type": "Billing::PaymentMethod"
}
```

| <div style="width:375px;">Event type</div>                            | Versions available | Description                                       | 
|---------------------------------------|--------------------|---------------------------------------------------|
| ***Orders::Transaction***                      |                    |                                                   |
| `orders/transaction.created`                   | V1, V2             | Sent when an Orders::Transaction has been created |
| `orders/transaction.updated`                   | V1, V2             | Sent when an Orders::Transaction has been updated |

**Invoice webhooks**

With the [Invoice payload](https://apidocs.myclickfunnels.com/tag/Orders::Invoice).

| <div style="width:375px;">Event type</div>   | Versions available   | Description                                                                 | 
|----------------------------------------------|----------------------|-----------------------------------------------------------------------------|
| ***Orders::Invoice***                        |                      |                                                                             |
| `orders/invoice.created`                     | V1, V2               | Sent when an Orders::Invoice has been created                               |
| `orders/invoice.updated`                     | V1, V2               | Sent when an Orders::Invoice has been updated                               |
| `orders/invoice.refunded`                    | V1, V2               | Sent when an Orders::Invoice has been refunded                              |
| `renewal-invoice-payment-declined`           | V1, V2               | Issued when a renewal Orders::Invoice payment has been declined             |
| ***OneTimeOrder::Invoice***                  |                      |                                                                             |
| `one-time-order.invoice.paid`                | V1, V2               | Sent when an Order::Invoice of `order_type: "one-time-order"` has been paid |
| ***Subscription::Invoice***                  |                      |                                                                             |
| `subscription/invoice.paid`                  | V1, V2               | Sent when an Order of `order_type: "subscription"` has been paid            |

**Workflow-based webhooks**

These are mostly used for [the UI-based ClickFunnels Workflows functionality](https://support.myclickfunnels.com/support/solutions/articles/150000156983-using-the-webhook-step-in-a-workflow).

| <div style="width:375px;">Event type</div>| Versions available | Description                                                        | 
|--------------------------------------------------|--------------------|--------------------------------------------------------------------| 
| ***Runs::Step***                                 |                    |                                                                    |
| `runs/step.dontrunme`                            | V1                 | Issued when the `dontrunme` step has been ran on a Workflow        |
| ***Workflows::Integration::Step***               |                    |                                                                    |
| `workflows_integration_step.executed`            | V1                 | Sent when a Workflows::Integration::Step has been executed         |
| ***Workflows::Steps::IntegrationStep***          |                    |                                                                    |
| `workflows/steps/integration_step.executed`      | V1                 | Sent when a Workflows::Steps::IntegrationStep has been executed    |
| ***Workflows::Steps::DeliverWebhookStep***       |                    |                                                                    |
| `workflows/steps/deliver_webhook_step.executed`  | V1                 | Sent when a Workflows::Steps::DeliverWebhookStep has been executed |


</div>

## Table of Contents<a id="table-of-contents"></a>

<!-- toc -->

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Reference](#reference)
  * [`clickfunnels.contact.createNewContact`](#clickfunnelscontactcreatenewcontact)
  * [`clickfunnels.contact.getContactById`](#clickfunnelscontactgetcontactbyid)
  * [`clickfunnels.contact.listForWorkspace`](#clickfunnelscontactlistforworkspace)
  * [`clickfunnels.contact.redactPersonallyIdentifiable`](#clickfunnelscontactredactpersonallyidentifiable)
  * [`clickfunnels.contact.removeById`](#clickfunnelscontactremovebyid)
  * [`clickfunnels.contact.updateContactById`](#clickfunnelscontactupdatecontactbyid)
  * [`clickfunnels.contact.upsert`](#clickfunnelscontactupsert)
  * [`clickfunnels.contactsAppliedTag.createAppliedTag`](#clickfunnelscontactsappliedtagcreateappliedtag)
  * [`clickfunnels.contactsAppliedTag.getForContact`](#clickfunnelscontactsappliedtaggetforcontact)
  * [`clickfunnels.contactsAppliedTag.list`](#clickfunnelscontactsappliedtaglist)
  * [`clickfunnels.contactsAppliedTag.removeById`](#clickfunnelscontactsappliedtagremovebyid)
  * [`clickfunnels.contactsTag.createNewTag`](#clickfunnelscontactstagcreatenewtag)
  * [`clickfunnels.contactsTag.getSingle`](#clickfunnelscontactstaggetsingle)
  * [`clickfunnels.contactsTag.list`](#clickfunnelscontactstaglist)
  * [`clickfunnels.contactsTag.remove`](#clickfunnelscontactstagremove)
  * [`clickfunnels.contactsTag.updateSpecificTag`](#clickfunnelscontactstagupdatespecifictag)
  * [`clickfunnels.course.getById`](#clickfunnelscoursegetbyid)
  * [`clickfunnels.course.listForWorkspace`](#clickfunnelscourselistforworkspace)
  * [`clickfunnels.coursesEnrollment.createNewEnrollment`](#clickfunnelscoursesenrollmentcreatenewenrollment)
  * [`clickfunnels.coursesEnrollment.getById`](#clickfunnelscoursesenrollmentgetbyid)
  * [`clickfunnels.coursesEnrollment.list`](#clickfunnelscoursesenrollmentlist)
  * [`clickfunnels.coursesEnrollment.updateSpecificEnrollment`](#clickfunnelscoursesenrollmentupdatespecificenrollment)
  * [`clickfunnels.coursesLesson.getById`](#clickfunnelscourseslessongetbyid)
  * [`clickfunnels.coursesLesson.listLessons`](#clickfunnelscourseslessonlistlessons)
  * [`clickfunnels.coursesLesson.updateLessonById`](#clickfunnelscourseslessonupdatelessonbyid)
  * [`clickfunnels.coursesSection.getSection`](#clickfunnelscoursessectiongetsection)
  * [`clickfunnels.coursesSection.listSections`](#clickfunnelscoursessectionlistsections)
  * [`clickfunnels.coursesSection.updateSectionById`](#clickfunnelscoursessectionupdatesectionbyid)
  * [`clickfunnels.form.createNewForm`](#clickfunnelsformcreatenewform)
  * [`clickfunnels.form.getForm`](#clickfunnelsformgetform)
  * [`clickfunnels.form.listWorkspaceForms`](#clickfunnelsformlistworkspaceforms)
  * [`clickfunnels.form.remove`](#clickfunnelsformremove)
  * [`clickfunnels.form.updateFormById`](#clickfunnelsformupdateformbyid)
  * [`clickfunnels.formsField.addNewField`](#clickfunnelsformsfieldaddnewfield)
  * [`clickfunnels.formsField.getField`](#clickfunnelsformsfieldgetfield)
  * [`clickfunnels.formsField.listFieldsForFieldSet`](#clickfunnelsformsfieldlistfieldsforfieldset)
  * [`clickfunnels.formsField.removeField`](#clickfunnelsformsfieldremovefield)
  * [`clickfunnels.formsField.updateFieldById`](#clickfunnelsformsfieldupdatefieldbyid)
  * [`clickfunnels.formsFieldSet.createNewFieldSet`](#clickfunnelsformsfieldsetcreatenewfieldset)
  * [`clickfunnels.formsFieldSet.getFieldSet`](#clickfunnelsformsfieldsetgetfieldset)
  * [`clickfunnels.formsFieldSet.list`](#clickfunnelsformsfieldsetlist)
  * [`clickfunnels.formsFieldSet.remove`](#clickfunnelsformsfieldsetremove)
  * [`clickfunnels.formsFieldSet.updateFieldSetById`](#clickfunnelsformsfieldsetupdatefieldsetbyid)
  * [`clickfunnels.formsFieldsOption.createNewFieldOption`](#clickfunnelsformsfieldsoptioncreatenewfieldoption)
  * [`clickfunnels.formsFieldsOption.deleteOptionForField`](#clickfunnelsformsfieldsoptiondeleteoptionforfield)
  * [`clickfunnels.formsFieldsOption.getFieldOption`](#clickfunnelsformsfieldsoptiongetfieldoption)
  * [`clickfunnels.formsFieldsOption.list`](#clickfunnelsformsfieldsoptionlist)
  * [`clickfunnels.formsFieldsOption.updateFieldOption`](#clickfunnelsformsfieldsoptionupdatefieldoption)
  * [`clickfunnels.formsSubmission.createNewSubmission`](#clickfunnelsformssubmissioncreatenewsubmission)
  * [`clickfunnels.formsSubmission.getById`](#clickfunnelsformssubmissiongetbyid)
  * [`clickfunnels.formsSubmission.list`](#clickfunnelsformssubmissionlist)
  * [`clickfunnels.formsSubmission.remove`](#clickfunnelsformssubmissionremove)
  * [`clickfunnels.formsSubmission.updateSubmission`](#clickfunnelsformssubmissionupdatesubmission)
  * [`clickfunnels.formsSubmissionsAnswer.addNewAnswer`](#clickfunnelsformssubmissionsansweraddnewanswer)
  * [`clickfunnels.formsSubmissionsAnswer.get`](#clickfunnelsformssubmissionsanswerget)
  * [`clickfunnels.formsSubmissionsAnswer.list`](#clickfunnelsformssubmissionsanswerlist)
  * [`clickfunnels.formsSubmissionsAnswer.removeById`](#clickfunnelsformssubmissionsanswerremovebyid)
  * [`clickfunnels.formsSubmissionsAnswer.updateAnswer`](#clickfunnelsformssubmissionsanswerupdateanswer)
  * [`clickfunnels.fulfillment.cancelFulfillment`](#clickfunnelsfulfillmentcancelfulfillment)
  * [`clickfunnels.fulfillment.create`](#clickfunnelsfulfillmentcreate)
  * [`clickfunnels.fulfillment.getById`](#clickfunnelsfulfillmentgetbyid)
  * [`clickfunnels.fulfillment.list`](#clickfunnelsfulfillmentlist)
  * [`clickfunnels.fulfillment.updateById`](#clickfunnelsfulfillmentupdatebyid)
  * [`clickfunnels.fulfillmentsLocation.createNewLocation`](#clickfunnelsfulfillmentslocationcreatenewlocation)
  * [`clickfunnels.fulfillmentsLocation.getById`](#clickfunnelsfulfillmentslocationgetbyid)
  * [`clickfunnels.fulfillmentsLocation.list`](#clickfunnelsfulfillmentslocationlist)
  * [`clickfunnels.fulfillmentsLocation.removeById`](#clickfunnelsfulfillmentslocationremovebyid)
  * [`clickfunnels.fulfillmentsLocation.updateById`](#clickfunnelsfulfillmentslocationupdatebyid)
  * [`clickfunnels.image.create`](#clickfunnelsimagecreate)
  * [`clickfunnels.image.getById`](#clickfunnelsimagegetbyid)
  * [`clickfunnels.image.list`](#clickfunnelsimagelist)
  * [`clickfunnels.image.removeById`](#clickfunnelsimageremovebyid)
  * [`clickfunnels.image.updateById`](#clickfunnelsimageupdatebyid)
  * [`clickfunnels.order.getSingle`](#clickfunnelsordergetsingle)
  * [`clickfunnels.order.listOrders`](#clickfunnelsorderlistorders)
  * [`clickfunnels.order.updateSpecific`](#clickfunnelsorderupdatespecific)
  * [`clickfunnels.ordersAppliedTag.createAppliedTag`](#clickfunnelsordersappliedtagcreateappliedtag)
  * [`clickfunnels.ordersAppliedTag.get`](#clickfunnelsordersappliedtagget)
  * [`clickfunnels.ordersAppliedTag.list`](#clickfunnelsordersappliedtaglist)
  * [`clickfunnels.ordersAppliedTag.removeById`](#clickfunnelsordersappliedtagremovebyid)
  * [`clickfunnels.ordersInvoice.getForOrder`](#clickfunnelsordersinvoicegetfororder)
  * [`clickfunnels.ordersInvoice.listForOrder`](#clickfunnelsordersinvoicelistfororder)
  * [`clickfunnels.ordersInvoicesRestock.getRestock`](#clickfunnelsordersinvoicesrestockgetrestock)
  * [`clickfunnels.ordersInvoicesRestock.listRestocks`](#clickfunnelsordersinvoicesrestocklistrestocks)
  * [`clickfunnels.ordersTag.createNewTag`](#clickfunnelsorderstagcreatenewtag)
  * [`clickfunnels.ordersTag.getSingle`](#clickfunnelsorderstaggetsingle)
  * [`clickfunnels.ordersTag.list`](#clickfunnelsorderstaglist)
  * [`clickfunnels.ordersTag.remove`](#clickfunnelsorderstagremove)
  * [`clickfunnels.ordersTag.updateSpecificOrderTag`](#clickfunnelsorderstagupdatespecificordertag)
  * [`clickfunnels.ordersTransaction.getById`](#clickfunnelsorderstransactiongetbyid)
  * [`clickfunnels.ordersTransaction.getList`](#clickfunnelsorderstransactiongetlist)
  * [`clickfunnels.product.addNewToWorkspace`](#clickfunnelsproductaddnewtoworkspace)
  * [`clickfunnels.product.archiveProduct`](#clickfunnelsproductarchiveproduct)
  * [`clickfunnels.product.getForWorkspace`](#clickfunnelsproductgetforworkspace)
  * [`clickfunnels.product.listForWorkspace`](#clickfunnelsproductlistforworkspace)
  * [`clickfunnels.product.unarchiveById`](#clickfunnelsproductunarchivebyid)
  * [`clickfunnels.product.updateForWorkspace`](#clickfunnelsproductupdateforworkspace)
  * [`clickfunnels.productsPrice.createVariantPrice`](#clickfunnelsproductspricecreatevariantprice)
  * [`clickfunnels.productsPrice.getSinglePrice`](#clickfunnelsproductspricegetsingleprice)
  * [`clickfunnels.productsPrice.listForVariant`](#clickfunnelsproductspricelistforvariant)
  * [`clickfunnels.productsPrice.updateSinglePrice`](#clickfunnelsproductspriceupdatesingleprice)
  * [`clickfunnels.productsTag.createNewTag`](#clickfunnelsproductstagcreatenewtag)
  * [`clickfunnels.productsTag.deleteTagById`](#clickfunnelsproductstagdeletetagbyid)
  * [`clickfunnels.productsTag.getTagById`](#clickfunnelsproductstaggettagbyid)
  * [`clickfunnels.productsTag.list`](#clickfunnelsproductstaglist)
  * [`clickfunnels.productsTag.updateTagById`](#clickfunnelsproductstagupdatetagbyid)
  * [`clickfunnels.productsVariant.createNewVariant`](#clickfunnelsproductsvariantcreatenewvariant)
  * [`clickfunnels.productsVariant.getSingle`](#clickfunnelsproductsvariantgetsingle)
  * [`clickfunnels.productsVariant.list`](#clickfunnelsproductsvariantlist)
  * [`clickfunnels.productsVariant.updateSingle`](#clickfunnelsproductsvariantupdatesingle)
  * [`clickfunnels.shippingLocationGroup.getProfileLocationGroup`](#clickfunnelsshippinglocationgroupgetprofilelocationgroup)
  * [`clickfunnels.shippingLocationGroup.list`](#clickfunnelsshippinglocationgrouplist)
  * [`clickfunnels.shippingPackage.addToWorkspace`](#clickfunnelsshippingpackageaddtoworkspace)
  * [`clickfunnels.shippingPackage.getForWorkspace`](#clickfunnelsshippingpackagegetforworkspace)
  * [`clickfunnels.shippingPackage.listForWorkspace`](#clickfunnelsshippingpackagelistforworkspace)
  * [`clickfunnels.shippingPackage.removeById`](#clickfunnelsshippingpackageremovebyid)
  * [`clickfunnels.shippingPackage.updateForWorkspace`](#clickfunnelsshippingpackageupdateforworkspace)
  * [`clickfunnels.shippingProfile.createNew`](#clickfunnelsshippingprofilecreatenew)
  * [`clickfunnels.shippingProfile.getWorkspaceProfile`](#clickfunnelsshippingprofilegetworkspaceprofile)
  * [`clickfunnels.shippingProfile.list`](#clickfunnelsshippingprofilelist)
  * [`clickfunnels.shippingProfile.remove`](#clickfunnelsshippingprofileremove)
  * [`clickfunnels.shippingProfile.updateForWorkspace`](#clickfunnelsshippingprofileupdateforworkspace)
  * [`clickfunnels.shippingRate.createRateForZone`](#clickfunnelsshippingratecreaterateforzone)
  * [`clickfunnels.shippingRate.getRateById`](#clickfunnelsshippingrategetratebyid)
  * [`clickfunnels.shippingRate.listForZone`](#clickfunnelsshippingratelistforzone)
  * [`clickfunnels.shippingRate.removeById`](#clickfunnelsshippingrateremovebyid)
  * [`clickfunnels.shippingRate.updateRateForZone`](#clickfunnelsshippingrateupdaterateforzone)
  * [`clickfunnels.shippingRatesName.createNewRateName`](#clickfunnelsshippingratesnamecreatenewratename)
  * [`clickfunnels.shippingRatesName.getRateName`](#clickfunnelsshippingratesnamegetratename)
  * [`clickfunnels.shippingRatesName.list`](#clickfunnelsshippingratesnamelist)
  * [`clickfunnels.shippingRatesName.remove`](#clickfunnelsshippingratesnameremove)
  * [`clickfunnels.shippingRatesName.updateName`](#clickfunnelsshippingratesnameupdatename)
  * [`clickfunnels.shippingZone.addNewZone`](#clickfunnelsshippingzoneaddnewzone)
  * [`clickfunnels.shippingZone.getZoneById`](#clickfunnelsshippingzonegetzonebyid)
  * [`clickfunnels.shippingZone.listZones`](#clickfunnelsshippingzonelistzones)
  * [`clickfunnels.shippingZone.removeById`](#clickfunnelsshippingzoneremovebyid)
  * [`clickfunnels.shippingZone.updateZoneById`](#clickfunnelsshippingzoneupdatezonebyid)
  * [`clickfunnels.team.getAll`](#clickfunnelsteamgetall)
  * [`clickfunnels.team.getSingle`](#clickfunnelsteamgetsingle)
  * [`clickfunnels.team.updateTeamById`](#clickfunnelsteamupdateteambyid)
  * [`clickfunnels.user.getSingle`](#clickfunnelsusergetsingle)
  * [`clickfunnels.user.listCurrentAccountUsers`](#clickfunnelsuserlistcurrentaccountusers)
  * [`clickfunnels.user.updateSingleUser`](#clickfunnelsuserupdatesingleuser)
  * [`clickfunnels.webhooksOutgoingEndpoint.createNew`](#clickfunnelswebhooksoutgoingendpointcreatenew)
  * [`clickfunnels.webhooksOutgoingEndpoint.get`](#clickfunnelswebhooksoutgoingendpointget)
  * [`clickfunnels.webhooksOutgoingEndpoint.listEndpoints`](#clickfunnelswebhooksoutgoingendpointlistendpoints)
  * [`clickfunnels.webhooksOutgoingEndpoint.updateEndpoint`](#clickfunnelswebhooksoutgoingendpointupdateendpoint)
  * [`clickfunnels.webhooksOutgoingEvent.getForWorkspace`](#clickfunnelswebhooksoutgoingeventgetforworkspace)
  * [`clickfunnels.webhooksOutgoingEvent.listForWorkspace`](#clickfunnelswebhooksoutgoingeventlistforworkspace)
  * [`clickfunnels.workspace.addNew`](#clickfunnelsworkspaceaddnew)
  * [`clickfunnels.workspace.getById`](#clickfunnelsworkspacegetbyid)
  * [`clickfunnels.workspace.listWorkspaces`](#clickfunnelsworkspacelistworkspaces)
  * [`clickfunnels.workspace.update`](#clickfunnelsworkspaceupdate)

<!-- tocstop -->

## Installation<a id="installation"></a>
<div align="center">
  <a href="https://konfigthis.com/sdk-sign-up?company=ClickFunnels&language=TypeScript">
    <img src="https://raw.githubusercontent.com/konfig-dev/brand-assets/HEAD/cta-images/typescript-cta.png" width="70%">
  </a>
</div>

## Getting Started<a id="getting-started"></a>

```typescript
import { ClickFunnels } from "click-funnels-typescript-sdk";

const clickfunnels = new ClickFunnels({
  // Defining the base path is optional and defaults to https://myworkspace.myclickfunnels.com/api/v2
  // basePath: "https://myworkspace.myclickfunnels.com/api/v2",
  accessToken: "ACCESS_TOKEN",
});

const createNewContactResponse = await clickfunnels.contact.createNewContact({
  workspaceId: 1,
});

console.log(createNewContactResponse);
```

## Reference<a id="reference"></a>


### `clickfunnels.contact.createNewContact`<a id="clickfunnelscontactcreatenewcontact"></a>

Add a new contact to the workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewContactResponse = await clickfunnels.contact.createNewContact({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### contact: `ContactParameters`<a id="contact-contactparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactAttributes](./models/contact-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/contacts` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.getContactById`<a id="clickfunnelscontactgetcontactbyid"></a>

Retrieve a contact

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getContactByIdResponse = await clickfunnels.contact.getContactById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactAttributes](./models/contact-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.listForWorkspace`<a id="clickfunnelscontactlistforworkspace"></a>

List contacts for the given workspace. By default, only identified contacts are shown so you won&#39;t see anonymous or GDPR-redacted contacts.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForWorkspaceResponse = await clickfunnels.contact.listForWorkspace({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

##### filter: [`ContactListForWorkspaceFilterParameter`](./models/contact-list-for-workspace-filter-parameter.ts)<a id="filter-contactlistforworkspacefilterparametermodelscontact-list-for-workspace-filter-parameterts"></a>

Filtering  - Keep in mind that depending on the tools that you use, you might run into different situations where additional encoding is needed. For example:     - You might need to encode `filter[id]=1` as `filter%5Bid%5D=1` or use special options in your tools of choice to do it for you (like `g` in CURL).     -  Special URL characters like `%`, `+`, or unicode characters in emails (like Chinese characters) will need additional encoding.  

#### 🔄 Return<a id="🔄-return"></a>

[ContactAttributes](./models/contact-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/contacts` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.redactPersonallyIdentifiable`<a id="clickfunnelscontactredactpersonallyidentifiable"></a>

This will destroy all personally identifiable information for a contact, including their name and phone number. This cannot be undone.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const redactPersonallyIdentifiableResponse =
  await clickfunnels.contact.redactPersonallyIdentifiable({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{id}/gdpr_destroy` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.removeById`<a id="clickfunnelscontactremovebyid"></a>

Delete a contact

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.contact.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.updateContactById`<a id="clickfunnelscontactupdatecontactbyid"></a>

Update a contact

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateContactByIdResponse = await clickfunnels.contact.updateContactById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### contact: `ContactParameters`<a id="contact-contactparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactAttributes](./models/contact-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contact.upsert`<a id="clickfunnelscontactupsert"></a>

Creates or updates a Contact, matching on the email address. If the Contact does not exist, it will be created. If the Contact does exist, it will be updated. It is not possible to delete a Contact via this endpoint. It is not possible to reset properties of a Contact by passing empty values. E.g. passing `null` for `first_name` or an empty array for `tag_ids` won't update previous values. To do that you would instead need to use the `Update Contact` endpoint.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const upsertResponse = await clickfunnels.contact.upsert({
  workspaceId: "workspaceId_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `string`<a id="workspaceid-string"></a>

##### contact: [`ContactsProperty`](./models/contacts-property.ts)<a id="contact-contactspropertymodelscontacts-propertyts"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactAttributes](./models/contact-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/contacts/upsert` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsAppliedTag.createAppliedTag`<a id="clickfunnelscontactsappliedtagcreateappliedtag"></a>

Assign a tag to a contact by creating an applied tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createAppliedTagResponse =
  await clickfunnels.contactsAppliedTag.createAppliedTag({
    contactId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### contactId: `number`<a id="contactid-number"></a>

##### contacts_applied_tag: `ContactsAppliedTagParameters`<a id="contacts_applied_tag-contactsappliedtagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactsAppliedTagAttributes](./models/contacts-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{contact_id}/applied_tags` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsAppliedTag.getForContact`<a id="clickfunnelscontactsappliedtaggetforcontact"></a>

Retrieve an applied tag for a contact

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getForContactResponse =
  await clickfunnels.contactsAppliedTag.getForContact({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactsAppliedTagAttributes](./models/contacts-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/applied_tags/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsAppliedTag.list`<a id="clickfunnelscontactsappliedtaglist"></a>

List the applied tags for a contact

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.contactsAppliedTag.list({
  contactId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### contactId: `number`<a id="contactid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ContactsAppliedTagAttributes](./models/contacts-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/{contact_id}/applied_tags` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsAppliedTag.removeById`<a id="clickfunnelscontactsappliedtagremovebyid"></a>

Remove a tag from a contact by deleting an applied tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.contactsAppliedTag.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/applied_tags/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsTag.createNewTag`<a id="clickfunnelscontactstagcreatenewtag"></a>

Add a new Contact Tag to your Workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewTagResponse = await clickfunnels.contactsTag.createNewTag({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### contacts_tag: `ContactsTagParameters`<a id="contacts_tag-contactstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactsTagAttributes](./models/contacts-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/contacts/tags` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsTag.getSingle`<a id="clickfunnelscontactstaggetsingle"></a>

Retrieve a single Contact Tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.contactsTag.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactsTagAttributes](./models/contacts-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/tags/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsTag.list`<a id="clickfunnelscontactstaglist"></a>

List all Contact Tags for your workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.contactsTag.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ContactsTagAttributes](./models/contacts-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/contacts/tags` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsTag.remove`<a id="clickfunnelscontactstagremove"></a>

Delete a Contact Tag from your workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.contactsTag.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/tags/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.contactsTag.updateSpecificTag`<a id="clickfunnelscontactstagupdatespecifictag"></a>

Update a Contact Tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSpecificTagResponse =
  await clickfunnels.contactsTag.updateSpecificTag({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### contacts_tag: `ContactsTagParameters`<a id="contacts_tag-contactstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ContactsTagAttributes](./models/contacts-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/contacts/tags/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.course.getById`<a id="clickfunnelscoursegetbyid"></a>

Retrieve a course

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.course.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CourseAttributes](./models/course-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.course.listForWorkspace`<a id="clickfunnelscourselistforworkspace"></a>

List courses for a team

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForWorkspaceResponse = await clickfunnels.course.listForWorkspace({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[CourseAttributes](./models/course-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/courses` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesEnrollment.createNewEnrollment`<a id="clickfunnelscoursesenrollmentcreatenewenrollment"></a>

Add a new enrollment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewEnrollmentResponse =
  await clickfunnels.coursesEnrollment.createNewEnrollment({
    courseId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### courseId: `number`<a id="courseid-number"></a>

##### courses_enrollment: `CoursesEnrollmentParameters`<a id="courses_enrollment-coursesenrollmentparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesEnrollmentAttributes](./models/courses-enrollment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/{course_id}/enrollments` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesEnrollment.getById`<a id="clickfunnelscoursesenrollmentgetbyid"></a>

Retrieve an enrollment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.coursesEnrollment.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesEnrollmentAttributes](./models/courses-enrollment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/enrollments/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesEnrollment.list`<a id="clickfunnelscoursesenrollmentlist"></a>

List enrollments for a course

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.coursesEnrollment.list({
  courseId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### courseId: `number`<a id="courseid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[CoursesEnrollmentAttributes](./models/courses-enrollment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/{course_id}/enrollments` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesEnrollment.updateSpecificEnrollment`<a id="clickfunnelscoursesenrollmentupdatespecificenrollment"></a>

Update an enrollment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSpecificEnrollmentResponse =
  await clickfunnels.coursesEnrollment.updateSpecificEnrollment({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### courses_enrollment: `CoursesEnrollmentParameters`<a id="courses_enrollment-coursesenrollmentparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesEnrollmentAttributes](./models/courses-enrollment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/enrollments/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesLesson.getById`<a id="clickfunnelscourseslessongetbyid"></a>

Fetch Lesson

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.coursesLesson.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesLessonAttributes](./models/courses-lesson-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/lessons/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesLesson.listLessons`<a id="clickfunnelscourseslessonlistlessons"></a>

List Lessons

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listLessonsResponse = await clickfunnels.coursesLesson.listLessons({
  sectionId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### sectionId: `number`<a id="sectionid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[CoursesLessonAttributes](./models/courses-lesson-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/sections/{section_id}/lessons` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesLesson.updateLessonById`<a id="clickfunnelscourseslessonupdatelessonbyid"></a>

Update Lesson

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateLessonByIdResponse =
  await clickfunnels.coursesLesson.updateLessonById({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### courses_lesson: `CoursesLessonParameters`<a id="courses_lesson-courseslessonparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesLessonAttributes](./models/courses-lesson-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/lessons/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesSection.getSection`<a id="clickfunnelscoursessectiongetsection"></a>

Fetch Section

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSectionResponse = await clickfunnels.coursesSection.getSection({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesSectionAttributes](./models/courses-section-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/sections/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesSection.listSections`<a id="clickfunnelscoursessectionlistsections"></a>

List Sections

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listSectionsResponse = await clickfunnels.coursesSection.listSections({
  courseId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### courseId: `number`<a id="courseid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[CoursesSectionAttributes](./models/courses-section-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/{course_id}/sections` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.coursesSection.updateSectionById`<a id="clickfunnelscoursessectionupdatesectionbyid"></a>

Update Section

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSectionByIdResponse =
  await clickfunnels.coursesSection.updateSectionById({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### courses_section: `CoursesSectionParameters`<a id="courses_section-coursessectionparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[CoursesSectionAttributes](./models/courses-section-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/courses/sections/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.form.createNewForm`<a id="clickfunnelsformcreatenewform"></a>

Add a new form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewFormResponse = await clickfunnels.form.createNewForm({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### form: `FormParameters`<a id="form-formparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormAttributes](./models/form-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/forms` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.form.getForm`<a id="clickfunnelsformgetform"></a>

Retrieve a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getFormResponse = await clickfunnels.form.getForm({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormAttributes](./models/form-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.form.listWorkspaceForms`<a id="clickfunnelsformlistworkspaceforms"></a>

List forms for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listWorkspaceFormsResponse = await clickfunnels.form.listWorkspaceForms({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormAttributes](./models/form-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/forms` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.form.remove`<a id="clickfunnelsformremove"></a>

Delete a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.form.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.form.updateFormById`<a id="clickfunnelsformupdateformbyid"></a>

Update a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateFormByIdResponse = await clickfunnels.form.updateFormById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### form: `FormParameters`<a id="form-formparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormAttributes](./models/form-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsField.addNewField`<a id="clickfunnelsformsfieldaddnewfield"></a>

Add a new field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addNewFieldResponse = await clickfunnels.formsField.addNewField({
  fieldSetId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### fieldSetId: `number`<a id="fieldsetid-number"></a>

##### forms_field: `FormsFieldParameters`<a id="forms_field-formsfieldparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldAttributes](./models/forms-field-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/field_sets/{field_set_id}/fields` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsField.getField`<a id="clickfunnelsformsfieldgetfield"></a>

Retrieve a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getFieldResponse = await clickfunnels.formsField.getField({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldAttributes](./models/forms-field-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsField.listFieldsForFieldSet`<a id="clickfunnelsformsfieldlistfieldsforfieldset"></a>

List fields for a field set

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listFieldsForFieldSetResponse =
  await clickfunnels.formsField.listFieldsForFieldSet({
    fieldSetId: 1,
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### fieldSetId: `number`<a id="fieldsetid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldAttributes](./models/forms-field-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/field_sets/{field_set_id}/fields` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsField.removeField`<a id="clickfunnelsformsfieldremovefield"></a>

Delete a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeFieldResponse = await clickfunnels.formsField.removeField({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsField.updateFieldById`<a id="clickfunnelsformsfieldupdatefieldbyid"></a>

Update a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateFieldByIdResponse = await clickfunnels.formsField.updateFieldById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### forms_field: `FormsFieldParameters`<a id="forms_field-formsfieldparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldAttributes](./models/forms-field-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldSet.createNewFieldSet`<a id="clickfunnelsformsfieldsetcreatenewfieldset"></a>

Add a new field set

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewFieldSetResponse =
  await clickfunnels.formsFieldSet.createNewFieldSet({
    formId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### formId: `number`<a id="formid-number"></a>

##### forms_field_set: `FormsFieldSetParameters`<a id="forms_field_set-formsfieldsetparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldSetAttributes](./models/forms-field-set-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{form_id}/field_sets` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldSet.getFieldSet`<a id="clickfunnelsformsfieldsetgetfieldset"></a>

Retrieve a field set

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getFieldSetResponse = await clickfunnels.formsFieldSet.getFieldSet({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldSetAttributes](./models/forms-field-set-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/field_sets/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldSet.list`<a id="clickfunnelsformsfieldsetlist"></a>

List field sets for a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.formsFieldSet.list({
  formId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### formId: `number`<a id="formid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldSetAttributes](./models/forms-field-set-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{form_id}/field_sets` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldSet.remove`<a id="clickfunnelsformsfieldsetremove"></a>

Delete a field set

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.formsFieldSet.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/field_sets/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldSet.updateFieldSetById`<a id="clickfunnelsformsfieldsetupdatefieldsetbyid"></a>

Update a field set

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateFieldSetByIdResponse =
  await clickfunnels.formsFieldSet.updateFieldSetById({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### forms_field_set: `FormsFieldSetParameters`<a id="forms_field_set-formsfieldsetparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldSetAttributes](./models/forms-field-set-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/field_sets/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldsOption.createNewFieldOption`<a id="clickfunnelsformsfieldsoptioncreatenewfieldoption"></a>

Add a new option to a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewFieldOptionResponse =
  await clickfunnels.formsFieldsOption.createNewFieldOption({
    fieldId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### fieldId: `number`<a id="fieldid-number"></a>

##### forms_fields_option: `FormsFieldsOptionParameters`<a id="forms_fields_option-formsfieldsoptionparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldsOptionAttributes](./models/forms-fields-option-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/{field_id}/options` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldsOption.deleteOptionForField`<a id="clickfunnelsformsfieldsoptiondeleteoptionforfield"></a>

Delete a option for a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteOptionForFieldResponse =
  await clickfunnels.formsFieldsOption.deleteOptionForField({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/options/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldsOption.getFieldOption`<a id="clickfunnelsformsfieldsoptiongetfieldoption"></a>

Retrieve a option for a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getFieldOptionResponse =
  await clickfunnels.formsFieldsOption.getFieldOption({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldsOptionAttributes](./models/forms-fields-option-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/options/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldsOption.list`<a id="clickfunnelsformsfieldsoptionlist"></a>

List options for a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.formsFieldsOption.list({
  fieldId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### fieldId: `number`<a id="fieldid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldsOptionAttributes](./models/forms-fields-option-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/{field_id}/options` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsFieldsOption.updateFieldOption`<a id="clickfunnelsformsfieldsoptionupdatefieldoption"></a>

Update a option for a field

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateFieldOptionResponse =
  await clickfunnels.formsFieldsOption.updateFieldOption({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### forms_fields_option: `FormsFieldsOptionParameters`<a id="forms_fields_option-formsfieldsoptionparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsFieldsOptionAttributes](./models/forms-fields-option-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/fields/options/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmission.createNewSubmission`<a id="clickfunnelsformssubmissioncreatenewsubmission"></a>

Add a new submission to a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewSubmissionResponse =
  await clickfunnels.formsSubmission.createNewSubmission({
    formId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### formId: `number`<a id="formid-number"></a>

##### forms_submission: `FormsSubmissionParameters`<a id="forms_submission-formssubmissionparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionAttributes](./models/forms-submission-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{form_id}/submissions` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmission.getById`<a id="clickfunnelsformssubmissiongetbyid"></a>

Retrieve a submission for a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.formsSubmission.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionAttributes](./models/forms-submission-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmission.list`<a id="clickfunnelsformssubmissionlist"></a>

List submissions for a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.formsSubmission.list({
  formId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### formId: `number`<a id="formid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionAttributes](./models/forms-submission-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/{form_id}/submissions` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmission.remove`<a id="clickfunnelsformssubmissionremove"></a>

Delete a submission for a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.formsSubmission.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmission.updateSubmission`<a id="clickfunnelsformssubmissionupdatesubmission"></a>

Update a submission for a form

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSubmissionResponse =
  await clickfunnels.formsSubmission.updateSubmission({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### forms_submission: `FormsSubmissionParameters`<a id="forms_submission-formssubmissionparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionAttributes](./models/forms-submission-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmissionsAnswer.addNewAnswer`<a id="clickfunnelsformssubmissionsansweraddnewanswer"></a>

Add a new answer to a submission

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addNewAnswerResponse =
  await clickfunnels.formsSubmissionsAnswer.addNewAnswer({
    submissionId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### submissionId: `number`<a id="submissionid-number"></a>

##### forms_submissions_answer: `FormsSubmissionsAnswerParameters`<a id="forms_submissions_answer-formssubmissionsanswerparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionsAnswerAttributes](./models/forms-submissions-answer-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/{submission_id}/answers` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmissionsAnswer.get`<a id="clickfunnelsformssubmissionsanswerget"></a>

Retrieve a answer for a submission

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await clickfunnels.formsSubmissionsAnswer.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionsAnswerAttributes](./models/forms-submissions-answer-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/answers/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmissionsAnswer.list`<a id="clickfunnelsformssubmissionsanswerlist"></a>

List answers for a submission

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.formsSubmissionsAnswer.list({
  submissionId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### submissionId: `number`<a id="submissionid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionsAnswerAttributes](./models/forms-submissions-answer-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/{submission_id}/answers` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmissionsAnswer.removeById`<a id="clickfunnelsformssubmissionsanswerremovebyid"></a>

Delete a answer for a submission

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.formsSubmissionsAnswer.removeById(
  {
    id: "id_example",
  }
);
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/answers/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.formsSubmissionsAnswer.updateAnswer`<a id="clickfunnelsformssubmissionsanswerupdateanswer"></a>

Update a answer for a submission

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateAnswerResponse =
  await clickfunnels.formsSubmissionsAnswer.updateAnswer({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### forms_submissions_answer: `FormsSubmissionsAnswerParameters`<a id="forms_submissions_answer-formssubmissionsanswerparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FormsSubmissionsAnswerAttributes](./models/forms-submissions-answer-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/forms/submissions/answers/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillment.cancelFulfillment`<a id="clickfunnelsfulfillmentcancelfulfillment"></a>

This will cancel a Fulfillment. A Fulfillment can only be cancelled when it's in a "fulfilled" state. The "cancelled" state is final.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const cancelFulfillmentResponse =
  await clickfunnels.fulfillment.cancelFulfillment({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentAttributes](./models/fulfillment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/{id}/cancel` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillment.create`<a id="clickfunnelsfulfillmentcreate"></a>

Create Fulfillment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await clickfunnels.fulfillment.create({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### fulfillment: `FulfillmentParameters`<a id="fulfillment-fulfillmentparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentAttributes](./models/fulfillment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/fulfillments` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillment.getById`<a id="clickfunnelsfulfillmentgetbyid"></a>

Fetch Fulfillment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.fulfillment.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentAttributes](./models/fulfillment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillment.list`<a id="clickfunnelsfulfillmentlist"></a>

List Fulfillments

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.fulfillment.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentAttributes](./models/fulfillment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/fulfillments` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillment.updateById`<a id="clickfunnelsfulfillmentupdatebyid"></a>

Update Fulfillment

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateByIdResponse = await clickfunnels.fulfillment.updateById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### fulfillment: `FulfillmentParameters`<a id="fulfillment-fulfillmentparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentAttributes](./models/fulfillment-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillmentsLocation.createNewLocation`<a id="clickfunnelsfulfillmentslocationcreatenewlocation"></a>

Create Location

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewLocationResponse =
  await clickfunnels.fulfillmentsLocation.createNewLocation({
    workspaceId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### fulfillments_location: `FulfillmentsLocationParameters`<a id="fulfillments_location-fulfillmentslocationparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentsLocationAttributes](./models/fulfillments-location-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/fulfillments/locations` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillmentsLocation.getById`<a id="clickfunnelsfulfillmentslocationgetbyid"></a>

Fetch Location

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.fulfillmentsLocation.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentsLocationAttributes](./models/fulfillments-location-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/locations/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillmentsLocation.list`<a id="clickfunnelsfulfillmentslocationlist"></a>

List Locations

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.fulfillmentsLocation.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentsLocationAttributes](./models/fulfillments-location-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/fulfillments/locations` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillmentsLocation.removeById`<a id="clickfunnelsfulfillmentslocationremovebyid"></a>

Remove Location

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.fulfillmentsLocation.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/locations/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.fulfillmentsLocation.updateById`<a id="clickfunnelsfulfillmentslocationupdatebyid"></a>

Update Location

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateByIdResponse = await clickfunnels.fulfillmentsLocation.updateById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### fulfillments_location: `FulfillmentsLocationParameters`<a id="fulfillments_location-fulfillmentslocationparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[FulfillmentsLocationAttributes](./models/fulfillments-location-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/fulfillments/locations/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.image.create`<a id="clickfunnelsimagecreate"></a>

Create Image

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createResponse = await clickfunnels.image.create({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### image: `ImageParameters`<a id="image-imageparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ImageAttributes](./models/image-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/images` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.image.getById`<a id="clickfunnelsimagegetbyid"></a>

Fetch Image

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.image.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ImageAttributes](./models/image-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/images/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.image.list`<a id="clickfunnelsimagelist"></a>

List Images

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.image.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ImageAttributes](./models/image-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/images` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.image.removeById`<a id="clickfunnelsimageremovebyid"></a>

Remove Image

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.image.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/images/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.image.updateById`<a id="clickfunnelsimageupdatebyid"></a>

Update Image

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateByIdResponse = await clickfunnels.image.updateById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### image: `ImageParameters`<a id="image-imageparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ImageAttributes](./models/image-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/images/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.order.getSingle`<a id="clickfunnelsordergetsingle"></a>

Retrieve a specific order in the current workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.order.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrderAttributes](./models/order-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.order.listOrders`<a id="clickfunnelsorderlistorders"></a>

List all orders for the current workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listOrdersResponse = await clickfunnels.order.listOrders({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

##### filter: [`OrderListOrdersFilterParameter`](./models/order-list-orders-filter-parameter.ts)<a id="filter-orderlistordersfilterparametermodelsorder-list-orders-filter-parameterts"></a>

Filtering  - Keep in mind that depending on the tools that you use, you might run into different situations where additional encoding is needed. For example:     - You might need to encode `filter[id]=1` as `filter%5Bid%5D=1` or use special options in your tools of choice to do it for you (like `g` in CURL).     -  Special URL characters like `%`, `+`, or unicode characters in emails (like Chinese characters) will need additional encoding.  

#### 🔄 Return<a id="🔄-return"></a>

[OrderAttributes](./models/order-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/orders` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.order.updateSpecific`<a id="clickfunnelsorderupdatespecific"></a>

Update a specific order in the current workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSpecificResponse = await clickfunnels.order.updateSpecific({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### order: `OrderParameters`<a id="order-orderparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrderAttributes](./models/order-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersAppliedTag.createAppliedTag`<a id="clickfunnelsordersappliedtagcreateappliedtag"></a>

Assign a tag to an order by creating an applied tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createAppliedTagResponse =
  await clickfunnels.ordersAppliedTag.createAppliedTag({
    orderId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### orderId: `number`<a id="orderid-number"></a>

##### orders_applied_tag: `OrdersAppliedTagParameters`<a id="orders_applied_tag-ordersappliedtagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersAppliedTagAttributes](./models/orders-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{order_id}/applied_tags` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersAppliedTag.get`<a id="clickfunnelsordersappliedtagget"></a>

Retrieve an applied tag for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await clickfunnels.ordersAppliedTag.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersAppliedTagAttributes](./models/orders-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/applied_tags/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersAppliedTag.list`<a id="clickfunnelsordersappliedtaglist"></a>

List the applied tags for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.ordersAppliedTag.list({
  orderId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### orderId: `number`<a id="orderid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[OrdersAppliedTagAttributes](./models/orders-applied-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{order_id}/applied_tags` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersAppliedTag.removeById`<a id="clickfunnelsordersappliedtagremovebyid"></a>

Remove a tag from an order by deleting an applied tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.ordersAppliedTag.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/applied_tags/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersInvoice.getForOrder`<a id="clickfunnelsordersinvoicegetfororder"></a>

Retrieve an invoice for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getForOrderResponse = await clickfunnels.ordersInvoice.getForOrder({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersInvoiceAttributes](./models/orders-invoice-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/invoices/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersInvoice.listForOrder`<a id="clickfunnelsordersinvoicelistfororder"></a>

List invoices for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForOrderResponse = await clickfunnels.ordersInvoice.listForOrder({
  orderId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### orderId: `number`<a id="orderid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[OrdersInvoiceAttributes](./models/orders-invoice-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{order_id}/invoices` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersInvoicesRestock.getRestock`<a id="clickfunnelsordersinvoicesrestockgetrestock"></a>

Fetch Restock

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getRestockResponse = await clickfunnels.ordersInvoicesRestock.getRestock({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersInvoicesRestockGetRestockResponse](./models/orders-invoices-restock-get-restock-response.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/invoices/restocks/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersInvoicesRestock.listRestocks`<a id="clickfunnelsordersinvoicesrestocklistrestocks"></a>

List Restocks

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listRestocksResponse =
  await clickfunnels.ordersInvoicesRestock.listRestocks({
    workspaceId: 1,
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[Restocks](./models/restocks.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/orders/invoices/restocks` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTag.createNewTag`<a id="clickfunnelsorderstagcreatenewtag"></a>

Add a new order tag to your workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewTagResponse = await clickfunnels.ordersTag.createNewTag({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### orders_tag: `OrdersTagParameters`<a id="orders_tag-orderstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTagAttributes](./models/orders-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/orders/tags` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTag.getSingle`<a id="clickfunnelsorderstaggetsingle"></a>

Retrieve a single order tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.ordersTag.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTagAttributes](./models/orders-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/tags/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTag.list`<a id="clickfunnelsorderstaglist"></a>

List all order tags for your workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.ordersTag.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTagAttributes](./models/orders-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/orders/tags` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTag.remove`<a id="clickfunnelsorderstagremove"></a>

Delete an order tag from your workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.ordersTag.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/tags/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTag.updateSpecificOrderTag`<a id="clickfunnelsorderstagupdatespecificordertag"></a>

Update an order tag

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSpecificOrderTagResponse =
  await clickfunnels.ordersTag.updateSpecificOrderTag({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### orders_tag: `OrdersTagParameters`<a id="orders_tag-orderstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTagAttributes](./models/orders-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/tags/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTransaction.getById`<a id="clickfunnelsorderstransactiongetbyid"></a>

Retrieve a transaction for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.ordersTransaction.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTransactionAttributes](./models/orders-transaction-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/transactions/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.ordersTransaction.getList`<a id="clickfunnelsorderstransactiongetlist"></a>

List transactions for an order

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getListResponse = await clickfunnels.ordersTransaction.getList({
  orderId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### orderId: `number`<a id="orderid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[OrdersTransactionAttributes](./models/orders-transaction-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/orders/{order_id}/transactions` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.addNewToWorkspace`<a id="clickfunnelsproductaddnewtoworkspace"></a>

Add a new product to a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addNewToWorkspaceResponse = await clickfunnels.product.addNewToWorkspace({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### product: `ProductParameters`<a id="product-productparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/products` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.archiveProduct`<a id="clickfunnelsproductarchiveproduct"></a>

This will archive a Product. A product can only be archived if it's not in the "live" state.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const archiveProductResponse = await clickfunnels.product.archiveProduct({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{id}/archive` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.getForWorkspace`<a id="clickfunnelsproductgetforworkspace"></a>

Retrieve a product for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getForWorkspaceResponse = await clickfunnels.product.getForWorkspace({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.listForWorkspace`<a id="clickfunnelsproductlistforworkspace"></a>

List products for a workspace. All products are listed regardless of `archived` state.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForWorkspaceResponse = await clickfunnels.product.listForWorkspace({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/products` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.unarchiveById`<a id="clickfunnelsproductunarchivebyid"></a>

This will unarchive a Product.

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const unarchiveByIdResponse = await clickfunnels.product.unarchiveById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{id}/unarchive` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.product.updateForWorkspace`<a id="clickfunnelsproductupdateforworkspace"></a>

Update a product for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateForWorkspaceResponse =
  await clickfunnels.product.updateForWorkspace({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### product: `ProductParameters`<a id="product-productparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductAttributes](./models/product-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsPrice.createVariantPrice`<a id="clickfunnelsproductspricecreatevariantprice"></a>

Create a new price for a given variant

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createVariantPriceResponse =
  await clickfunnels.productsPrice.createVariantPrice({
    productId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### productId: `number`<a id="productid-number"></a>

##### products_price: `ProductsPriceParameters`<a id="products_price-productspriceparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsPriceAttributes](./models/products-price-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{product_id}/prices` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsPrice.getSinglePrice`<a id="clickfunnelsproductspricegetsingleprice"></a>

Retrieve a single price

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSinglePriceResponse = await clickfunnels.productsPrice.getSinglePrice({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsPriceAttributes](./models/products-price-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/prices/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsPrice.listForVariant`<a id="clickfunnelsproductspricelistforvariant"></a>

List all prices for a given variant

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForVariantResponse = await clickfunnels.productsPrice.listForVariant({
  productId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### productId: `number`<a id="productid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ProductsPriceAttributes](./models/products-price-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{product_id}/prices` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsPrice.updateSinglePrice`<a id="clickfunnelsproductspriceupdatesingleprice"></a>

Update a single price

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSinglePriceResponse =
  await clickfunnels.productsPrice.updateSinglePrice({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### products_price: `ProductsPriceParameters`<a id="products_price-productspriceparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsPriceAttributes](./models/products-price-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/prices/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsTag.createNewTag`<a id="clickfunnelsproductstagcreatenewtag"></a>

Add a new tag to a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewTagResponse = await clickfunnels.productsTag.createNewTag({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### products_tag: `ProductsTagParameters`<a id="products_tag-productstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsTagAttributes](./models/products-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/products/tags` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsTag.deleteTagById`<a id="clickfunnelsproductstagdeletetagbyid"></a>

Delete a tag for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const deleteTagByIdResponse = await clickfunnels.productsTag.deleteTagById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/tags/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsTag.getTagById`<a id="clickfunnelsproductstaggettagbyid"></a>

Retrieve a tag for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getTagByIdResponse = await clickfunnels.productsTag.getTagById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsTagAttributes](./models/products-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/tags/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsTag.list`<a id="clickfunnelsproductstaglist"></a>

List tags for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.productsTag.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ProductsTagAttributes](./models/products-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/products/tags` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsTag.updateTagById`<a id="clickfunnelsproductstagupdatetagbyid"></a>

Update a tag for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateTagByIdResponse = await clickfunnels.productsTag.updateTagById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### products_tag: `ProductsTagParameters`<a id="products_tag-productstagparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsTagAttributes](./models/products-tag-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/tags/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsVariant.createNewVariant`<a id="clickfunnelsproductsvariantcreatenewvariant"></a>

Create a new variant for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewVariantResponse =
  await clickfunnels.productsVariant.createNewVariant({
    productId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### productId: `number`<a id="productid-number"></a>

##### products_variant: `ProductsVariantParameters`<a id="products_variant-productsvariantparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsVariantAttributes](./models/products-variant-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{product_id}/variants` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsVariant.getSingle`<a id="clickfunnelsproductsvariantgetsingle"></a>

Retrieve a single variant

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.productsVariant.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsVariantAttributes](./models/products-variant-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/variants/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsVariant.list`<a id="clickfunnelsproductsvariantlist"></a>

List variants for a product

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.productsVariant.list({
  productId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### productId: `number`<a id="productid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ProductsVariantAttributes](./models/products-variant-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/{product_id}/variants` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.productsVariant.updateSingle`<a id="clickfunnelsproductsvariantupdatesingle"></a>

Update a single variant

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSingleResponse = await clickfunnels.productsVariant.updateSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### products_variant: `ProductsVariantParameters`<a id="products_variant-productsvariantparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ProductsVariantAttributes](./models/products-variant-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/products/variants/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingLocationGroup.getProfileLocationGroup`<a id="clickfunnelsshippinglocationgroupgetprofilelocationgroup"></a>

Retrieve a location group for a profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getProfileLocationGroupResponse =
  await clickfunnels.shippingLocationGroup.getProfileLocationGroup({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingLocationGroupAttributes](./models/shipping-location-group-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/location_groups/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingLocationGroup.list`<a id="clickfunnelsshippinglocationgrouplist"></a>

List location groups for a profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.shippingLocationGroup.list({
  profileId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### profileId: `number`<a id="profileid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingLocationGroupAttributes](./models/shipping-location-group-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/profiles/{profile_id}/location_groups` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingPackage.addToWorkspace`<a id="clickfunnelsshippingpackageaddtoworkspace"></a>

Add a new package to a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addToWorkspaceResponse =
  await clickfunnels.shippingPackage.addToWorkspace({
    workspaceId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### shipping_package: `ShippingPackageParameters`<a id="shipping_package-shippingpackageparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingPackageAttributes](./models/shipping-package-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/packages` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingPackage.getForWorkspace`<a id="clickfunnelsshippingpackagegetforworkspace"></a>

Retrieve a package for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getForWorkspaceResponse =
  await clickfunnels.shippingPackage.getForWorkspace({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingPackageAttributes](./models/shipping-package-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/packages/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingPackage.listForWorkspace`<a id="clickfunnelsshippingpackagelistforworkspace"></a>

List packages for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForWorkspaceResponse =
  await clickfunnels.shippingPackage.listForWorkspace({
    workspaceId: 1,
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingPackageAttributes](./models/shipping-package-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/packages` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingPackage.removeById`<a id="clickfunnelsshippingpackageremovebyid"></a>

Delete a package for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.shippingPackage.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/packages/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingPackage.updateForWorkspace`<a id="clickfunnelsshippingpackageupdateforworkspace"></a>

Update a package for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateForWorkspaceResponse =
  await clickfunnels.shippingPackage.updateForWorkspace({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### shipping_package: `ShippingPackageParameters`<a id="shipping_package-shippingpackageparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingPackageAttributes](./models/shipping-package-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/packages/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingProfile.createNew`<a id="clickfunnelsshippingprofilecreatenew"></a>

Add a new shipping profile to a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewResponse = await clickfunnels.shippingProfile.createNew({
  workspaceId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### shipping_profile: `ShippingProfileParameters`<a id="shipping_profile-shippingprofileparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingProfileAttributes](./models/shipping-profile-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/profiles` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingProfile.getWorkspaceProfile`<a id="clickfunnelsshippingprofilegetworkspaceprofile"></a>

Retrieve a shipping profile for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getWorkspaceProfileResponse =
  await clickfunnels.shippingProfile.getWorkspaceProfile({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingProfileAttributes](./models/shipping-profile-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/profiles/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingProfile.list`<a id="clickfunnelsshippingprofilelist"></a>

List shipping profiles for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.shippingProfile.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingProfileAttributes](./models/shipping-profile-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/profiles` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingProfile.remove`<a id="clickfunnelsshippingprofileremove"></a>

Delete a shipping profile for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.shippingProfile.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/profiles/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingProfile.updateForWorkspace`<a id="clickfunnelsshippingprofileupdateforworkspace"></a>

Update a shipping profile for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateForWorkspaceResponse =
  await clickfunnels.shippingProfile.updateForWorkspace({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### shipping_profile: `ShippingProfileParameters`<a id="shipping_profile-shippingprofileparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingProfileAttributes](./models/shipping-profile-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/profiles/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRate.createRateForZone`<a id="clickfunnelsshippingratecreaterateforzone"></a>

Add a new shipping rate to a zone

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createRateForZoneResponse =
  await clickfunnels.shippingRate.createRateForZone({
    zoneId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### zoneId: `number`<a id="zoneid-number"></a>

##### shipping_rate: `ShippingRateParameters`<a id="shipping_rate-shippingrateparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRateAttributes](./models/shipping-rate-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/zones/{zone_id}/rates` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRate.getRateById`<a id="clickfunnelsshippingrategetratebyid"></a>

Retrieve a shipping rate for a zone

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getRateByIdResponse = await clickfunnels.shippingRate.getRateById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRateAttributes](./models/shipping-rate-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRate.listForZone`<a id="clickfunnelsshippingratelistforzone"></a>

List shipping rates for a zone

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForZoneResponse = await clickfunnels.shippingRate.listForZone({
  zoneId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### zoneId: `number`<a id="zoneid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRateAttributes](./models/shipping-rate-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/zones/{zone_id}/rates` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRate.removeById`<a id="clickfunnelsshippingrateremovebyid"></a>

Delete a shipping rate for a zone

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.shippingRate.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRate.updateRateForZone`<a id="clickfunnelsshippingrateupdaterateforzone"></a>

Update a shipping rate for a zone

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateRateForZoneResponse =
  await clickfunnels.shippingRate.updateRateForZone({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### shipping_rate: `ShippingRateParameters`<a id="shipping_rate-shippingrateparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRateAttributes](./models/shipping-rate-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRatesName.createNewRateName`<a id="clickfunnelsshippingratesnamecreatenewratename"></a>

Add a new rate name to a shipping profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewRateNameResponse =
  await clickfunnels.shippingRatesName.createNewRateName({
    workspaceId: 1,
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### shipping_rates_name: `ShippingRatesNameParameters`<a id="shipping_rates_name-shippingratesnameparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRatesNameAttributes](./models/shipping-rates-name-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/rates/names` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRatesName.getRateName`<a id="clickfunnelsshippingratesnamegetratename"></a>

Retrieve a rate name for a shipping profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getRateNameResponse = await clickfunnels.shippingRatesName.getRateName({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRatesNameAttributes](./models/shipping-rates-name-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/names/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRatesName.list`<a id="clickfunnelsshippingratesnamelist"></a>

List rate names for a shipping profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listResponse = await clickfunnels.shippingRatesName.list({
  workspaceId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRatesNameAttributes](./models/shipping-rates-name-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/shipping/rates/names` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRatesName.remove`<a id="clickfunnelsshippingratesnameremove"></a>

Delete a rate name for a shipping profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeResponse = await clickfunnels.shippingRatesName.remove({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/names/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingRatesName.updateName`<a id="clickfunnelsshippingratesnameupdatename"></a>

Update a rate name for a shipping profile

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateNameResponse = await clickfunnels.shippingRatesName.updateName({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### shipping_rates_name: `ShippingRatesNameParameters`<a id="shipping_rates_name-shippingratesnameparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingRatesNameAttributes](./models/shipping-rates-name-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/rates/names/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingZone.addNewZone`<a id="clickfunnelsshippingzoneaddnewzone"></a>

Add a new zone to a location group

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addNewZoneResponse = await clickfunnels.shippingZone.addNewZone({
  locationGroupId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### locationGroupId: `number`<a id="locationgroupid-number"></a>

##### shipping_zone: `ShippingZoneParameters`<a id="shipping_zone-shippingzoneparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingZoneAttributes](./models/shipping-zone-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/location_groups/{location_group_id}/zones` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingZone.getZoneById`<a id="clickfunnelsshippingzonegetzonebyid"></a>

Retrieve a zone for a location group

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getZoneByIdResponse = await clickfunnels.shippingZone.getZoneById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingZoneAttributes](./models/shipping-zone-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/zones/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingZone.listZones`<a id="clickfunnelsshippingzonelistzones"></a>

List zones for a location group

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listZonesResponse = await clickfunnels.shippingZone.listZones({
  locationGroupId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### locationGroupId: `number`<a id="locationgroupid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[ShippingZoneAttributes](./models/shipping-zone-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/location_groups/{location_group_id}/zones` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingZone.removeById`<a id="clickfunnelsshippingzoneremovebyid"></a>

Delete a zone for a location group

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const removeByIdResponse = await clickfunnels.shippingZone.removeById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/zones/{id}` `DELETE`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.shippingZone.updateZoneById`<a id="clickfunnelsshippingzoneupdatezonebyid"></a>

Update a zone for a location group

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateZoneByIdResponse = await clickfunnels.shippingZone.updateZoneById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### shipping_zone: `ShippingZoneParameters`<a id="shipping_zone-shippingzoneparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[ShippingZoneAttributes](./models/shipping-zone-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/shipping/zones/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.team.getAll`<a id="clickfunnelsteamgetall"></a>

List all teams for the current account

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getAllResponse = await clickfunnels.team.getAll({
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[TeamAttributes](./models/team-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/teams` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.team.getSingle`<a id="clickfunnelsteamgetsingle"></a>

Retrieve a single team

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.team.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[TeamAttributes](./models/team-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/teams/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.team.updateTeamById`<a id="clickfunnelsteamupdateteambyid"></a>

List all teams for the current account

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateTeamByIdResponse = await clickfunnels.team.updateTeamById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### team: `TeamParameters`<a id="team-teamparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[TeamAttributes](./models/team-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/teams/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.user.getSingle`<a id="clickfunnelsusergetsingle"></a>

Retrieve a single user

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getSingleResponse = await clickfunnels.user.getSingle({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[UserAttributes](./models/user-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/users/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.user.listCurrentAccountUsers`<a id="clickfunnelsuserlistcurrentaccountusers"></a>

List all users for the current account

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listCurrentAccountUsersResponse =
  await clickfunnels.user.listCurrentAccountUsers({
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[UserAttributes](./models/user-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/users` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.user.updateSingleUser`<a id="clickfunnelsuserupdatesingleuser"></a>

Update a single user

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateSingleUserResponse = await clickfunnels.user.updateSingleUser({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### user: `UserParameters`<a id="user-userparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[UserAttributes](./models/user-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/users/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEndpoint.createNew`<a id="clickfunnelswebhooksoutgoingendpointcreatenew"></a>

Add a new webhook endpoint to a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const createNewResponse = await clickfunnels.webhooksOutgoingEndpoint.createNew(
  {
    workspaceId: 1,
  }
);
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### webhooks_outgoing_endpoint: `WebhooksOutgoingEndpointParameters`<a id="webhooks_outgoing_endpoint-webhooksoutgoingendpointparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEndpointAttributes](./models/webhooks-outgoing-endpoint-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/webhooks/outgoing/endpoints` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEndpoint.get`<a id="clickfunnelswebhooksoutgoingendpointget"></a>

Retrieve a webhook endpoint for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getResponse = await clickfunnels.webhooksOutgoingEndpoint.get({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEndpointAttributes](./models/webhooks-outgoing-endpoint-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/webhooks/outgoing/endpoints/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEndpoint.listEndpoints`<a id="clickfunnelswebhooksoutgoingendpointlistendpoints"></a>

List webhook endpoints for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listEndpointsResponse =
  await clickfunnels.webhooksOutgoingEndpoint.listEndpoints({
    workspaceId: 1,
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEndpointAttributes](./models/webhooks-outgoing-endpoint-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/webhooks/outgoing/endpoints` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEndpoint.updateEndpoint`<a id="clickfunnelswebhooksoutgoingendpointupdateendpoint"></a>

Update a webhook endpoint for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateEndpointResponse =
  await clickfunnels.webhooksOutgoingEndpoint.updateEndpoint({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### webhooks_outgoing_endpoint: `WebhooksOutgoingEndpointParameters`<a id="webhooks_outgoing_endpoint-webhooksoutgoingendpointparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEndpointAttributes](./models/webhooks-outgoing-endpoint-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/webhooks/outgoing/endpoints/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEvent.getForWorkspace`<a id="clickfunnelswebhooksoutgoingeventgetforworkspace"></a>

Retrieve an webhook event for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getForWorkspaceResponse =
  await clickfunnels.webhooksOutgoingEvent.getForWorkspace({
    id: "id_example",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEventAttributes](./models/webhooks-outgoing-event-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/webhooks/outgoing/events/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.webhooksOutgoingEvent.listForWorkspace`<a id="clickfunnelswebhooksoutgoingeventlistforworkspace"></a>

List webhook events for a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listForWorkspaceResponse =
  await clickfunnels.webhooksOutgoingEvent.listForWorkspace({
    workspaceId: 1,
    sortOrder: "asc",
  });
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### workspaceId: `number`<a id="workspaceid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[WebhooksOutgoingEventAttributes](./models/webhooks-outgoing-event-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{workspace_id}/webhooks/outgoing/events` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.workspace.addNew`<a id="clickfunnelsworkspaceaddnew"></a>

Add a new workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const addNewResponse = await clickfunnels.workspace.addNew({
  teamId: 1,
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### teamId: `number`<a id="teamid-number"></a>

##### workspace: `WorkspaceParameters`<a id="workspace-workspaceparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WorkspaceAttributes](./models/workspace-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/teams/{team_id}/workspaces` `POST`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.workspace.getById`<a id="clickfunnelsworkspacegetbyid"></a>

Retrieve a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const getByIdResponse = await clickfunnels.workspace.getById({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WorkspaceAttributes](./models/workspace-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{id}` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.workspace.listWorkspaces`<a id="clickfunnelsworkspacelistworkspaces"></a>

List workspaces for a team

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const listWorkspacesResponse = await clickfunnels.workspace.listWorkspaces({
  teamId: 1,
  sortOrder: "asc",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### teamId: `number`<a id="teamid-number"></a>

##### after: `string`<a id="after-string"></a>

ID of item after which the collection should be returned

##### sortOrder: `'asc' | 'desc'`<a id="sortorder-asc--desc"></a>

Sort order of a list response. Use \'desc\' to reverse the default \'asc\' (ascending) sort order.

#### 🔄 Return<a id="🔄-return"></a>

[WorkspaceAttributes](./models/workspace-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/teams/{team_id}/workspaces` `GET`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


### `clickfunnels.workspace.update`<a id="clickfunnelsworkspaceupdate"></a>

Update a workspace

#### 🛠️ Usage<a id="🛠️-usage"></a>

```typescript
const updateResponse = await clickfunnels.workspace.update({
  id: "id_example",
});
```

#### ⚙️ Parameters<a id="⚙️-parameters"></a>

##### id: `string`<a id="id-string"></a>

##### workspace: `WorkspaceParameters`<a id="workspace-workspaceparameters"></a>

#### 🔄 Return<a id="🔄-return"></a>

[WorkspaceAttributes](./models/workspace-attributes.ts)

#### 🌐 Endpoint<a id="🌐-endpoint"></a>

`/workspaces/{id}` `PUT`

[🔙 **Back to Table of Contents**](#table-of-contents)

---


## Author<a id="author"></a>
This TypeScript package is automatically generated by [Konfig](https://konfigthis.com)
