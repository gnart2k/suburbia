"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import axios from "axios"
import { addressApi } from "@/lib/const"
import PreviousMap from "postcss/lib/previous-map"


// Extend your validation schema to include the address selections
const FormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  shippingAddress: z.string().min(5, { message: "Shipping address must be at least 5 characters." }),
  province: z.string().min(1, { message: "Please select a province." }),
  district: z.string().min(1, { message: "Please select a district." }),
  ward: z.string().min(1, { message: "Please select a ward." }),
})

export default function OrderForm() {
  const [provinces, setProvinces] = useState<ProvinceType[]>([])
  const [districts, setDistricts] = useState<DistrictType[]>([])
  const [wards, setWards] = useState<WardType[]>([])
const [userAddress, setUserAddress] = useState<UserAddressType>();
  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(addressApi)
        setProvinces(response.data)
      } catch (error) {
        console.error("Error fetching provinces", error)
      }
    }
    fetchProvinces()
  }, [])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      shippingAddress: "",
      province: "",
      district: "",
      ward: "",
    },
  })

  const selectedProvinceCode = form.watch("province")
  const selectedDistrictCode = form.watch("district")
  const selectedWardCode = form.watch("ward")

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvinceCode) {
      axios
        .get(`${addressApi}/p/${selectedProvinceCode}`, {
            params: { depth: 2 },
          })
        .then((response) => {
          setDistricts(response.data.districts)
          setUserAddress(prev => {
            if (!prev) {
              return { province: response.data } as UserAddressType;
            }
            // Otherwise, update the province while preserving other fields
            return { ...prev, province: response.data };
          });
          console.log(response.data.districts)
          // Reset district and ward if province changes
          form.setValue("district", "")
          setWards([])
          form.setValue("ward", "")
        })
        .catch((error) => console.error("Error fetching districts", error))
    } else {
      setDistricts([])
      setWards([])
      form.setValue("district", "")
      form.setValue("ward", "")
    }
  }, [selectedProvinceCode, form])

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrictCode) {
      axios
        .get(`${addressApi}/d/${selectedDistrictCode}`, {
            params: { depth: 2 },
          })
        .then((response) => {
          setWards(response.data.wards)
          console.log(response.data.wards)
          setUserAddress(prev => {
            if (!prev) {
              return { district: response.data } as UserAddressType;
            }
            // Otherwise, update the province while preserving other fields
            return { ...prev, district: response.data };
          });
          // Reset ward if district changes
          form.setValue("ward", "")
        })
        .catch((error) => console.error("Error fetching wards", error))
    } else {
      setWards([])
      form.setValue("ward", "")
    }
  }, [selectedDistrictCode, form])

  useEffect(() => {
    if (selectedWardCode) {
        const selectedWard = wards.find((ward) => ward.code === parseInt(selectedWardCode))
        if (selectedWard) {
          setUserAddress(prev => {
            if (!prev) {
              return { ward: selectedWard } as UserAddressType;
            }
            return { ...prev, ward: selectedWard };
          });
        }
    } else {
      setWards([])
      form.setValue("ward", "")
    }
  }, [selectedWardCode, form])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
    console.log(userAddress)
    toast.success("Order placed successfully!")
    console.log("Order Data:", data)
  }

  function onCancel() {
    form.reset()
    toast("Form reset.")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6 mt-12">
        <h2>Complete your order</h2>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>



        {/* Dropdowns for Province, District, Ward */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {/* Province Dropdown */}
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mr-2">Province</FormLabel>
                <FormControl>
                  <select {...field} className="p-2 border rounded">
                    <option value="">Select a province</option>
                    {provinces.map((province) => (
                      <option key={province.code} value={province.code}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* District Dropdown */}
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mr-2">District</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="p-2 border rounded"
                    disabled={!selectedProvinceCode || districts.length === 0}
                  >
                    <option value="">Select a district</option>
                    {districts?.map((district) => (
                      <option key={district.code} value={district.code}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ward Dropdown */}
          <FormField
            control={form.control}
            name="ward"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="mr-2">Ward</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="p-2 border rounded"
                    disabled={!selectedDistrictCode || wards.length === 0}
                  >
                    <option value="">Select a ward</option>
                    {wards.map((ward) => (
                      <option key={ward.code} value={ward.code}>
                        {ward.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Shipping Address Input */}
        <div className="mt-8">
          <FormField
            control={form.control}
            name="shippingAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Address</FormLabel>
                <FormControl onChange={(e) => {
                    setUserAddress(prev => {
                      if (!prev) {
                        //@ts-ignore
                        return { address: e.target.value } as UserAddressType;
                      }
                        //@ts-ignore
                      return { ...prev, address: e.target.value };
                    });
                  }}>
                  <Input placeholder="123 Main St, City, Country" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Checkout</Button>
        </div>
      </form>
    </Form>
  )
}
